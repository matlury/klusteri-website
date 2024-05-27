from datetime import datetime
from django.test import TestCase
from ilotalo.models import NightResponsibility

class NightResponsibilityTestCase(TestCase):
        # Creating a new NightResponsibility object via test data
    def setUp(self):
        global current_time 
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.night_responsibility = NightResponsibility.objects.create(
            username="test_user",
            email="test@example.com",
            responsible_for="Testing duties",
            login_time=current_time,
            logout_time="1970-01-02T14:00:00",
            present=True,
            late=False
        )
    # Testing the creation of a NightResponsibility object and the correctness of its attributes
    def test_night_responsibility_creation(self):
        self.assertEqual(self.night_responsibility.username, "test_user")
        self.assertEqual(self.night_responsibility.email, "test@example.com")
        self.assertEqual(self.night_responsibility.responsible_for, "Testing duties")
        self.assertEqual(str(self.night_responsibility.login_time)[:-13], current_time)
        self.assertEqual(str(self.night_responsibility.logout_time)[:-13], current_time)
        self.assertTrue(self.night_responsibility.present)
        self.assertFalse(self.night_responsibility.late)
