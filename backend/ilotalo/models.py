from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.

class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        '''
        if not email:
            raise ValueError('ei toimi')
        email = self.normalize_email(email)
        '''
        user = self.model(email=email, name=name)

        user.set_password(password)
        user.save()

        return user
    
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, default="")
    email = models.EmailField(max_length=100, default="", unique=True)
    telegram = models.CharField(max_length=100, default="", unique=True)
    role = models.IntegerField(default=5)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'password']



'''
class User(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, default="")
    email = models.EmailField(max_length=100, default="", unique=True)
    telegram = models.CharField(max_length=100, default="", unique=True)
    role = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.username}, {self.email}"
'''        

class Organization(models.Model):
    name = models.CharField(max_length=50, default="", unique=True)
    email = models.EmailField(max_length=100, default="", unique=True)
    homepage = models.CharField(max_length=100, default="")
    size = models.IntegerField(default=0)

