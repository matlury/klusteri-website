from django.test import TestCase
from django.core.exceptions import ValidationError
from ilotalo.models import NightResponsibility, User

# Create your tests here.
class UserTest(TestCase):
    def setUp(self):
        User.objects.create(
            username="testuser",
            password=1234,
            email="test@gmail.com",
            telegram="testtg",
            role=5,
        )

    def test_too_long_password(self):
        """
        Test creating a new user with a password over 20 characters long
        """
        new_user = User.objects.create(
            username="name",
            password=1234567899876543211111,
            email="test@helsinki.com",
            telegram="tgname",
            role=5,
        )

        # Function full_clean() checks if an object has valid parameters
        with self.assertRaises(ValidationError):
            new_user.full_clean()

    def test_too_long_username(self):
        """
        Test creating a new user with a password over 20 characters long
        """

        new_user = User.objects.create(
            username="usernameisovertwentycharacters",
            password=12345,
            email="test@helsinki.com",
            telegram="tgname",
            role=5,
        )

        with self.assertRaises(ValidationError):
            new_user.full_clean()

class NightResponsibilityTestCase(TestCase):
        # Creating a new NightResponsibility object via test data
    def setUp(self):
        self.night_responsibility = NightResponsibility.objects.create(
            username="test_user",
            email="test@example.com",
            responsible_for="Testing duties",
            login_time="1970-01-01T12:00:00",
            logout_time="1970-01-02T14:00:00",
            present=True,
            late=False
        )
    # Testing the creation of a NightResponsibility object and the correctness of its attributes
    def test_night_responsibility_creation(self):
        self.assertEqual(self.night_responsibility.username, "test_user")
        self.assertEqual(self.night_responsibility.email, "test@example.com")
        self.assertEqual(self.night_responsibility.responsible_for, "Testing duties")
        self.assertEqual(str(self.night_responsibility.login_time), "1970-01-01T12:00:00")
        self.assertEqual(str(self.night_responsibility.logout_time), "1970-01-02T14:00:00")
        self.assertTrue(self.night_responsibility.present)
        self.assertFalse(self.night_responsibility.late)
