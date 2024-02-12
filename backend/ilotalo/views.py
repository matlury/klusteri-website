from rest_framework import viewsets
from .serializers import UserSerializer, OrganizationSerializer
from .models import User, Organization
# Create your views here.

#Comment

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class OrganizationView(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()