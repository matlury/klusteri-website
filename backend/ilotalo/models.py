"""
Models define what kind of objects can be stored in the database
"""

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UserAccountManager(BaseUserManager):
    """
    Custom manager for creating users.

    Inheritance
    -----------
    BaseUserManager: Provides two utility methods
        - normalize_email(email): lowercases the domain portion of the email address
        - get_by_natural_key(username): retreives a user's data using USERNAME_FIELD
    """

    def create_user(self, username, password, email, telegram, role):
        """Create a new User object"""
        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(
            username=username,
            password=password,
            email=email,
            telegram=telegram,
            role=role,
        )

        # Hash the password and save the User object
        user.set_password(password)
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    The custom User model.

    Inheritance
    -----------
    AbstractBaseUser: Core implementation of a user model. Includes i.e. password hashing and tokenized password resets.
    PermissionsMixin: Django's permission framework
    """

    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, default="")
    email = models.EmailField(max_length=100, default="", unique=True)
    telegram = models.CharField(max_length=100, default="", blank=True)
    role = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    # USERNAME_FIELD defines the unique identifier of a User object. It can be i.e. username or email
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "password", "role"]


class Organization(models.Model):
    """Model for student organizations"""

    name = models.CharField(max_length=50, default="", unique=True)
    email = models.EmailField(max_length=100, default="", unique=True)
    homepage = models.CharField(max_length=100, default="")
    size = models.IntegerField(default=0)
