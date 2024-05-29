"""
Models define what kind of objects can be stored in the database
"""
from django.utils import timezone
from datetime import datetime
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class Organization(models.Model):
    """Model for student organizations"""

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default="", unique=True)
    email = models.EmailField(max_length=100, default="", unique=True)
    homepage = models.CharField(max_length=100, default="")
    size = models.IntegerField(default=0)

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
            role=role
        )

        # Hash the password and save the User object
        user.set_password(password)
        user.save()

        return user


class User(AbstractBaseUser):
    """
    The custom User model.

    Inheritance
    -----------
    AbstractBaseUser: Core implementation of a user model. Includes i.e. password hashing and tokenized password resets.
    """

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=255, default="")
    email = models.EmailField(max_length=100, default="", unique=True)
    telegram = models.CharField(max_length=100, default="", blank=True)
    role = models.IntegerField(default=5)
    keys = models.ManyToManyField(Organization)

    objects = UserAccountManager()

    # USERNAME_FIELD defines the unique identifier of a User object. It can be i.e. username or email
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "password", "role"]

class Event(models.Model):
    """
    Represents an event with specific attributes such as start and end time, room, reservation details,
    description, responsible party, and whether it is open or not.
    """

    # Fields for event attributes
    start = models.DateTimeField(
        auto_now_add = True,
        blank = True
    )
    end = models.DateTimeField(
        auto_now = True,
        blank = True,
    )
    title = models.CharField(max_length=100, default="") # Name of the event
    organizer = models.CharField(max_length=100, default="") # Organization responsible for the event
    description = models.CharField(max_length=500, default="")  # Description of the event
    responsible = models.CharField(max_length=100, default="")  # Person responsible for the event
    open = models.BooleanField(default=True)  # Indicates whether the event is open or not
    room = models.CharField(max_length=50, default="")  # Room where the event takes place

class NightResponsibility(models.Model):
    """
    NightResponsibility model for tracking user responsibilities during night shifts.
    This model records user information such as username, email, responsibilities, 
    login and logout times, and attendance status.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    responsible_for = models.CharField(max_length=500, default="")
    login_time = models.DateTimeField(
        auto_now_add = True,
        blank = True
    )
    logout_time = models.DateTimeField(
        auto_now = True,
        blank = True,
    )
    present = models.BooleanField(default=True)
    late = models.BooleanField(default=False)
    created_by = models.CharField(max_length=50, default="")

class DefectFault(models.Model):
    """Model for defects and faults in Klusteri."""

    description = models.CharField(max_length=300, default="")
    email_sent = models.BooleanField(default=False)
    repaired = models.BooleanField(default=False)
