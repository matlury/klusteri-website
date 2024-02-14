from rest_framework import viewsets
from .serializers import UserSerializer, OrganizationSerializer
from .models import User, Organization
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
# Create your views here.

#Comment

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class OrganizationView(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        username = data['username']
        password = data['password']
        email = data['email']
        telegram = data['telegram']
        role = data['role']

        user = User.objects.create_user(username, password, email, telegram, role)
        user = UserSerializer(user)


        return Response(user.data, status=status.HTTP_201_CREATED)

class RetrieveUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        pass