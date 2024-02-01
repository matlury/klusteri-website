from django.test import TestCase
from django.core.exceptions import ValidationError
from ilotalo.models import User


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
