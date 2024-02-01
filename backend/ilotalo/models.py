from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, default="")
    email = models.CharField(max_length=100, default="", unique=True)
    telegram = models.CharField(max_length=100, default="", unique=True)
    role = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.username}, {self.email}"

class Organization(models.Model):
    name = models.CharField(max_length=50, default="", unique=True)
    email = models.CharField(max_length=100, default="", unique=True)
    homepage = models.CharField(max_length=100, default="")
    size = models.IntegerField(default=0)
