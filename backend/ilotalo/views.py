from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import User

from django.http import HttpResponse

# Create your views here.

# def index(request):
#     # return render(request, 'ilotalo/index.html')
#     return render(request, 'frontend/index.html')

class IndexView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
