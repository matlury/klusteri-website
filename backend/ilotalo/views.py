from django.shortcuts import render
from django.http import HttpResponse
import pymongo
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import User
from .utils import db_connection

# Create your views here.

class IndexView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

connection = db_connection(
    "<mongodb url here>",
    "softwareproject",
    "users",
)

db_collection = connection[2]

user = {"username": "Valtteri", "password": "12345", "role": 5}

db_collection.insert_one(user)