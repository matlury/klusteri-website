from rest_framework import viewsets
from .serializers import (
    UserSerializer,
    OrganizationSerializer,
    UserNoPasswordSerializer,
)
from .models import User, Organization
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status


class UserView(viewsets.ModelViewSet):
    """Displays a list of all User objects at <baseurl>/users/"""

    serializer_class = UserSerializer
    queryset = User.objects.all()


class OrganizationView(viewsets.ModelViewSet):
    """Displays a list of all Organization objects at <baseurl>/organizations/"""

    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()


class RegisterView(APIView):
    """View for creating a new user at <baseurl>/api/users/register/"""

    def post(self, request):
        data = request.data
        serializer = UserSerializer(data=data)

        # Check if the request contains valid data
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.create(serializer.validated_data)
        user = UserNoPasswordSerializer(user)

        return Response(user.data, status=status.HTTP_201_CREATED)


class RetrieveUserView(APIView):
    """View for fetching a User object with a JSON web token at <baseurl>/api/users/userlist/"""

    #IsAuthenticated permission class will deny entry for unauthenticated users
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user = UserSerializer(user)

        return Response(user.data, status=status.HTTP_200_OK)
