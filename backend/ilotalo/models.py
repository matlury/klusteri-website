from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, default="")
    email = models.CharField(max_length=100, default="")
    telegram = models.CharField(max_length=100, default="")
    role = models.IntegerField(default=5)
