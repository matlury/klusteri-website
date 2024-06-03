from datetime import datetime, timezone
from django.test import TestCase
from ilotalo.models import NightResponsibility, User, Organization

class UserTestCase(TestCase):
    # Creating a new User object via test data
    def setUp(self):
        self.org = Organization.objects.create(
            name="TKO-äly",
            email="tko@aly.fi",
            homepage="tekis.fi",
            size=1,
        )
        self.user = User.objects.create(
            username="admin",
            password="salasana123",
            email="admin@admin.fi",
            role=1,
        )

    # Testing the creation of a NightResponsibility object and the correctness of its attributes
    def test_user_creation(self):
        self.assertEqual(self.user.username, "admin")
        self.assertEqual(self.user.email, "admin@admin.fi")

    def test_user_add_keys(self):
        self.user.keys.add(self.org)
        self.assertTrue(self.user.keys.all().contains(self.org))

class OrganizationTestCase(TestCase):
    # Creating a new User object via test data
    def setUp(self):
        self.org = Organization.objects.create(
            name="TKO-äly",
            email="tko@aly.fi",
            homepage="tekis.fi",
            size=1,
        )

    # Testing the creation of a NightResponsibility object and the correctness of its attributes
    def test_org_creation(self):
        self.assertEqual(self.org.name, "TKO-äly")
        self.assertEqual(self.org.email, "tko@aly.fi")
        self.assertEqual(self.org.homepage, "tekis.fi")

class NightResponsibilityTestCase(TestCase):
    # Creating a new NightResponsibility object via test data
    def setUp(self):
        global current_time 
        current_time = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        self.org = Organization.objects.create(
            name="TKO-äly",
            email="tko@aly.fi",
            homepage="tekis.fi",
            size=1,
        )
        self.user = User.objects.create(
            username="admin",
            password="salasana123",
            email="admin@admin.fi",
            role=1,
        )
        self.user.keys.add(self.org)
        self.night_responsibility = NightResponsibility.objects.create(
            user=self.user,
            responsible_for="Testing duties",
            login_time=current_time,
            logout_time=current_time,
            present=True,
            late=False
        )
        self.night_responsibility.organizations.add(self.user.keys.all()[0])

    # Testing the creation of a NightResponsibility object and the correctness of its attributes
    def test_night_responsibility_creation(self):
        self.assertEqual(self.night_responsibility.user.username, "admin")
        self.assertEqual(self.night_responsibility.user.email, "admin@admin.fi")
        self.assertTrue(self.night_responsibility.organizations.all().contains(self.org))
        self.assertEqual(self.night_responsibility.responsible_for, "Testing duties")
        self.assertEqual(str(self.night_responsibility.login_time)[:-13], current_time)
        self.assertEqual(str(self.night_responsibility.logout_time)[:-13], current_time)
        self.assertTrue(self.night_responsibility.present)
        self.assertFalse(self.night_responsibility.late)
