from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UserAccountManager(BaseUserManager):
    def create_user(self, username, password, email, telegram, role):
        """
        if not email:
            raise ValueError('ei toimi')
        email = self.normalize_email(email)
        email = email.lower()
        """
        user = self.model(
            username=username,
            password=password,
            email=email,
            telegram=telegram,
            role=role,
        )

        user.set_password(password)
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, default="")
    email = models.EmailField(max_length=100, default="", unique=True)
    telegram = models.CharField(max_length=100, default="", blank=True)
    role = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "password", "role"]
    
class Organization(models.Model):
    name = models.CharField(max_length=50, default="", unique=True)
    email = models.EmailField(max_length=100, default="", unique=True)
    homepage = models.CharField(max_length=100, default="")
    size = models.IntegerField(default=0)
