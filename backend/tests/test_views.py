import icalendar
import os as os_module
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient
from ilotalo.models import User, Organization, Event, NightResponsibility
from datetime import datetime, timedelta
from ilotalo.apps import IlotaloConfig
from django.apps import apps
from unittest.mock import patch, MagicMock


class ViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Ensure clean state if DB isolation is not perfect in container
        Event.objects.all().delete()
        Organization.objects.all().delete()
        User.objects.all().delete()

        self.org = Organization.objects.create(
            name="Test Org",
            email="test@org.com",
            homepage="http://test.org"
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@user.com",
            password="password123",
            telegram="testuser_tg",
            role=1
        )

        # Get token for authentication
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        self.event = Event.objects.create(
            title="Test Event",
            start=timezone.now() + timedelta(days=1),
            end=timezone.now() + timedelta(days=1, hours=2),
            organizer=self.org,
            created_by=self.user,
            room="Test Room",
            responsible="Test Person",
            description="Test Description"
        )

    def test_event_ical_view(self):
        """Test that the iCal view returns a valid .ics file with the event."""
        response = self.client.get("/api/events/ical/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'],
                         "text/calendar; charset=utf-8")
        self.assertIn('attachment; filename="ilotalo_events.ics"',
                      response['Content-Disposition'])

        cal = icalendar.Calendar.from_ical(response.content)
        self.assertEqual(cal.get('prodid'),
                         '-//Ilotalo Events Calendar//matlu.fi//')

        # Check if the event is in the calendar
        events = [component for component in cal.walk()
                  if component.name == "VEVENT"]
        self.assertEqual(len(events), 1)
        self.assertEqual(str(events[0].get('summary')), "Test Event")
        self.assertEqual(str(events[0].get('location')), "Test Room")
        # iCal now only includes organizer name for PII protection (no responsible person or description)
        self.assertIn("Järjestäjä: Test Org", str(
            events[0].get('description')))

    def test_event_ical_view_filtering(self):
        """Test that the iCal view only returns events from the last 30 days and future."""
        # Old event (more than 30 days ago)
        Event.objects.create(
            title="Old Event",
            start=timezone.now() - timedelta(days=40),
            end=timezone.now() - timedelta(days=40, hours=2),
            organizer=self.org,
            created_by=self.user,
            room="Old Room",
            responsible="Old Person",
            description="Old Description"
        )

        response = self.client.get("/api/events/ical/")
        cal = icalendar.Calendar.from_ical(response.content)
        events = [component for component in cal.walk()
                  if component.name == "VEVENT"]

        # Should only have the "Test Event" from setUp, not the "Old Event"
        self.assertEqual(len(events), 1)
        self.assertEqual(str(events[0].get('summary')), "Test Event")

    def test_event_list_filtering(self):
        """Test that EventView filters by start/end/all correctly."""
        # Create events in different months
        now = timezone.now()
        Event.objects.create(
            title="Next Month Event",
            start=now + timedelta(days=31),
            end=now + timedelta(days=31, hours=1),
            organizer=self.org, created_by=self.user, room="Room"
        )

        # 1. Default (current month only)
        response = self.client.get(
            "/api/listobjects/events/",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        # Handle paginated response
        events = response.data.get('results', response.data) if isinstance(
            response.data, dict) else response.data
        if len(events) != 1:
            print(
                f"DEBUG: Found {len(events)} events: {[e['title'] for e in events]}")
            print(f"DEBUG: Current month: {now.month}, year: {now.year}")
            for e in Event.objects.all():
                print(f"DEBUG: DB Event: {e.title}, start: {e.start}")
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]['title'], "Test Event")

        # 2. Filter by start/end
        start_str = (now + timedelta(days=30)).strftime('%Y-%m-%d')
        end_str = (now + timedelta(days=35)).strftime('%Y-%m-%d')
        response = self.client.get(
            f"/api/listobjects/events/?start={start_str}&end={end_str}",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Next Month Event")

        # 3. 'all' parameter
        response = self.client.get(
            "/api/listobjects/events/?all=true",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        self.assertEqual(len(response.data), 2)

    def test_event_list_filtering_iso_datetime(self):
        """Test that EventView correctly parses ISO datetime format from frontend."""
        now = timezone.now()

        # Create an event in the future
        future_event = Event.objects.create(
            title="Future Event",
            start=now + timedelta(days=15),
            end=now + timedelta(days=15, hours=2),
            organizer=self.org, created_by=self.user, room="Room"
        )

        # Test with ISO datetime format (like frontend sends)
        start_iso = now.isoformat()
        end_iso = (now + timedelta(days=30)).isoformat()

        response = self.client.get(
            f"/api/listobjects/events/?start={start_iso}&end={end_iso}",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        self.assertEqual(response.status_code, 200)
        # Should get both "Test Event" and "Future Event"
        self.assertGreaterEqual(len(response.data), 1)

        # Test with ISO datetime format with 'Z' suffix (UTC)
        start_iso_z = now.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        end_iso_z = (now + timedelta(days=30)
                     ).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

        response = self.client.get(
            f"/api/listobjects/events/?start={start_iso_z}&end={end_iso_z}",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_event_edit_permissions(self):
        # Ensure only event creator can edit
        self.client.force_authenticate(user=self.user)
        response = self.client.put(
            f'/api/events/update_event/{self.event.id}/', {'title': 'Updated Event'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure regular users without reservation rights cannot edit others' events
        other_user = User.objects.create_user(
            username="otheruser",
            email="other@user.com",
            password="password123",
            telegram="otheruser_tg",
            role=5  # TAVALLINEN (regular user)
        )
        # Ensure rights_for_reservation is False (default)
        other_user.rights_for_reservation = False
        other_user.save()

        self.client.force_authenticate(user=other_user)
        response = self.client.put(
            f'/api/events/update_event/{self.event.id}/', {'title': 'Malicious Update'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_event_pagination_logic(self):
        """Test that pagination is disabled when start/end/all is provided."""
        from ilotalo.views import EventView
        view = EventView()
        view.request = MagicMock()

        view.request.query_params = {'all': 'true'}
        self.assertIsNone(view.paginate_queryset([]))

        view.request.query_params = {'start': '2023-01-01'}
        self.assertIsNone(view.paginate_queryset([]))


class YKVTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="ykvuser",
            email="ykv@test.com",
            password="password123",
            telegram="ykv_tg",
            role=4  # Avaimellinen
        )
        self.client.force_authenticate(user=self.user)
        self.org = Organization.objects.create(
            name="YKV Org", email="ykv@org.com")

    def test_ykv_late_logout(self):
        """Test that logout after 7:15 AM is marked as late."""
        now = timezone.now()
        yesterday = now - timedelta(days=1)

        resp = NightResponsibility.objects.create(
            user=self.user,
            responsible_for="Guests",
            present=True
        )
        # Update login_time after creation (auto_now_add prevents setting it during create)
        resp.login_time = yesterday.replace(hour=22, minute=0)
        resp.save()

        with patch('ilotalo.views.datetime') as mock_datetime:
            # Set "now" to 8:00 AM today (after 7:15 AM threshold)
            fixed_now = now.replace(hour=8, minute=0, second=0, microsecond=0)
            mock_datetime.now.return_value = fixed_now
            mock_datetime.strptime.side_effect = datetime.strptime

            logout_time_str = fixed_now.strftime("%Y-%m-%d %H:%M")
            response = self.client.put(
                f"/api/ykv/logout_responsibility/{resp.id}/",
                data={"logout_time": logout_time_str}
            )

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertTrue(response.data['late'])
            self.assertFalse(response.data['present'])

    def test_force_logout_function(self):
        """Test the force_logout_ykv_logins utility function."""
        from ilotalo.views import force_logout_ykv_logins

        # Create active responsibility
        resp = NightResponsibility.objects.create(
            user=self.user,
            responsible_for="Guests",
            present=True
        )

        result = force_logout_ykv_logins()
        self.assertTrue(result.startswith("Successfully logged out"))

        resp.refresh_from_db()
        self.assertFalse(resp.present)
        self.assertTrue(resp.late)


class AppsTests(TestCase):
    @patch('ilotalo.apps.post_migrate.connect')
    @patch('django.core.signals.request_started.connect')
    def test_apps_ready_testing(self, mock_request_started, mock_post_migrate):
        """Test IlotaloConfig.ready() behavior during testing."""
        config = apps.get_app_config('ilotalo')
        with patch('sys.argv', ['manage.py', 'test']):
            config.ready()
        mock_post_migrate.assert_not_called()
        mock_request_started.assert_not_called()

    @patch('ilotalo.apps.get_user_model')
    @patch.dict(os_module.environ, {
        'DJANGO_DEFAULT_ADMIN_USERNAME': 'testadmin',
        'DJANGO_DEFAULT_ADMIN_EMAIL': 'admin@test.com',
        'DJANGO_DEFAULT_ADMIN_PASSWORD': 'TestPass123'
    })
    def test_create_default_user(self, mock_get_user_model):
        """Test the create_default_user signal handler."""
        from ilotalo.apps import create_default_user
        mock_user_model = MagicMock()
        mock_get_user_model.return_value = mock_user_model

        # Case 1: Users already exist
        mock_user_model.objects.exists.return_value = True
        create_default_user(None)
        mock_user_model.objects.create_user.assert_not_called()

        # Case 2: No users exist and env vars are set
        mock_user_model.objects.exists.return_value = False
        mock_user_model.objects.filter.return_value.exists.return_value = False
        create_default_user(None)
        mock_user_model.objects.create_user.assert_called_once_with(
            'testadmin', 'TestPass123', 'admin@test.com', "", 1
        )
