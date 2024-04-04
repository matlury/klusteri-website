from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core.exceptions import ObjectDoesNotExist
from .serializers import (
    UserSerializer,
    OrganizationSerializer,
    UserNoPasswordSerializer,
    UserUpdateSerializer,
    EventSerializer,
    NightResponsibilitySerializer,
)
from .models import User, Organization, Event, NightResponsibility
from .config import Role
from datetime import datetime
import os

LEPPISPJ = Role.LEPPISPJ.value
LEPPISVARAPJ = Role.LEPPISVARAPJ.value
MUOKKAUS = Role.MUOKKAUS.value
AVAIMELLINEN = Role.AVAIMELLINEN.value
TAVALLINEN = Role.TAVALLINEN.value

"""
Views receive web requests and return web responses.
More info: https://www.django-rest-framework.org/api-guide/views/
"""


class UserView(viewsets.ModelViewSet):
    """
    Displays a list of all User objects at <baseurl>/users/
    Actions provided by ModelViewSet:
        .list(), .retrieve(), .create(), .update(), .partial_update(), .delete()
    Each method listed above can be overwritten for customized object management
    """

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

    # Isauthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Request for fetching a user's data

        Parameters
        ----------
        request: str
            Client sends an access token to this endpoint and it is converted to
            the matching user's unique identifier (email address)
        """
        user = request.user
        user = UserSerializer(user)

        return Response(user.data, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    """View for updating a User object at <baseurl>/api/users/update/<user.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        """
        Request for updating the email address

        Parameters
        ----------
        request: dict
            Contains the new data
        pk (primary key): str
            Id of the User object to be updated
        """

        # All users can edit their own information
        if int(pk) == request.user.id:
            try:
                user_to_update = User.objects.get(id=pk)
            except ObjectDoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)
            
            user_serializer = UserUpdateSerializer(
                instance=user_to_update, data=request.data, partial=True
            )

            if user_serializer.is_valid():
                user_serializer.save()
                return Response(user_serializer.data, status=status.HTTP_200_OK)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = UserSerializer(request.user)

        # Leppispj and Leppisvarapj can only edit users that have role muokkaus
        if user.data["role"] in [LEPPISPJ, LEPPISVARAPJ]:
            try:
                user_to_update = User.objects.get(id=pk)
            except ObjectDoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)
            
            if user_to_update.role == MUOKKAUS:
                user = UserUpdateSerializer(
                    instance=user_to_update, data=request.data, partial=True
                )
                if user.is_valid():
                    user.save()
                    return Response(user.data, status=status.HTTP_200_OK)
                return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("You are not allowed to edit this user", status=status.HTTP_400_BAD_REQUEST)
        
        # Muokkaus users can only edit users that have role avaimellinen
        elif user.data["role"] == MUOKKAUS:
            try:
                user_to_update = User.objects.get(id=pk)
            except ObjectDoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)
            
            if user_to_update.role == AVAIMELLINEN:
                user = UserUpdateSerializer(
                    instance=user_to_update, data=request.data, partial=True
                )
                if user.is_valid():
                    user.save()
                    return Response(user.data, status=status.HTTP_200_OK)
                return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("You are not allowed to edit this user", status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response("You are not allowed to edit users", status=status.HTTP_400_BAD_REQUEST)

class CreateOrganizationView(APIView):
    """View for creating a new organization <baseurl>/api/organizations/create"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = UserSerializer(request.user)

        if user.data["role"] != LEPPISPJ:
            return Response(
                "Only LeppisPJ can create organizations",
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = OrganizationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RemoveOrganizationView(APIView):
    """View for creating a new organization <baseurl>/api/organizations/create"""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        user = UserSerializer(request.user)

        if user.data["role"] != LEPPISPJ:
            return Response(
                "Only LeppisPJ can remove organizations",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            organization_to_remove = Organization.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response(
                "Organization not found", status=status.HTTP_404_NOT_FOUND
            )

        organization_to_remove.delete()

        return Response(f"Organization {organization_to_remove.name} successfully removed", status=status.HTTP_200_OK)

class UpdateOrganizationView(APIView):
    """
    View for updating an Organization object at <baseurl>/api/organizations/update_organization/<int:pk>/
    LeppisPJ and Leppisvarapj (role 1, 2) can edit all organizations, Muokkaus user (role 3) can only edit
    organizations it is member of, other users can't edit organizations.
    """

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] in [LEPPISPJ, LEPPISVARAPJ]:
            return self.update_organization(request, pk)
        elif user.data["role"] == MUOKKAUS:
            organization = self.get_organization(pk)
            if organization and organization in request.user.organization.all():
                return self.update_organization(request, pk)
            else:
                return Response(
                    "You can't edit an organization you are not a member of",
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                "You can't edit organizations",
                status=status.HTTP_400_BAD_REQUEST,
            )
    
    def get_organization(self, pk):
        try:
            return Organization.objects.get(id=pk)
        except ObjectDoesNotExist:
            return None
    
    def update_organization(self, request, pk):
        organization_to_update = self.get_organization(pk)

        if not organization_to_update:
            return Response("Organization not found", status=status.HTTP_404_NOT_FOUND)

        organization = OrganizationSerializer(
            instance=organization_to_update, data=request.data, partial=True
        )

        if organization.is_valid():
            organization.save()
            return Response(organization.data, status=status.HTTP_200_OK)
        return Response(organization.errors, status=status.HTTP_400_BAD_REQUEST)

class AddUserOrganizationView(APIView):
    """
    View for adding User to an Organization <baseurl>/api/organizations/add_user_organization
    Only Leppispj and Leppisvarapj can add users to organizations for now, data needed to add user
    to organization: user id and organization id
    """
    
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ
        ]:
            return Response(
                "You can't add members to organizations",
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        user_id = request.data.get('user_id')
        organization_id = request.data.get('organization_id')
        try:
            user = User.objects.get(pk=user_id)
            organization = Organization.objects.get(pk=organization_id)
        except User.DoesNotExist:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        except Organization.DoesNotExist:
            return Response("Organization not found", status=status.HTTP_404_NOT_FOUND)
        
        user.organization.add(organization)
        return Response("User added to organization successfully", status=status.HTTP_201_CREATED)

class EventView(viewsets.ModelViewSet):
    """
    Displays a list of all Event objects at <baseurl>/events/
    Actions provided by ModelViewSet:
        .list(), .retrieve(), .create(), .update(), .partial_update(), .delete()
    Each method listed above can be overwritten for customized object management
    """

    serializer_class = EventSerializer
    queryset = Event.objects.all()

class CreateEventView(APIView):
    """View for creating a new event <baseurl>/api/events/create_event"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
            AVAIMELLINEN
        ]:
            return Response(
                "You can't add an event",
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EventSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RemoveEventView(APIView):
    """View for removing an event <baseurl>/api/events/delete_event/<event.id>/"""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        """ pk = primary key """
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
            AVAIMELLINEN
        ]:
            return Response(
                "You can't remove the event",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event_to_remove = Event.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response(
                "Event not found", status=status.HTTP_404_NOT_FOUND
            )

        event_to_remove.delete()

        return Response(f"Event {event_to_remove.reservation} successfully removed", status=status.HTTP_200_OK)

class UpdateEventView(APIView):
    """View for updating an Event object at <baseurl>/api/events/update_event/<event.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
            AVAIMELLINEN
        ]:
            return Response(
                "You can't edit the event",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event_to_update = Event.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("Event not found", status=status.HTTP_404_NOT_FOUND)

        event = EventSerializer(
            instance=event_to_update, data=request.data, partial=True
        )

        if event.is_valid():
            event.save()
            return Response(event.data, status=status.HTTP_200_OK)
        return Response(event.errors, status=status.HTTP_400_BAD_REQUEST)

class NightResponsibilityView(viewsets.ModelViewSet):
    """
    Displays a list of all NightResponsibility objects at <baseurl>/ykv/
    Actions provided by ModelViewSet:
        .list(), .retrieve(), .create(), .update(), .partial_update(), .delete()
    Each method listed above can be overwritten for customized object management
    """

    serializer_class = NightResponsibilitySerializer
    queryset = NightResponsibility.objects.all()

class CreateNightResponsibilityView(APIView):
    """View for creating a new ykv <baseurl>/api/ykv/create_responsibility"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
            AVAIMELLINEN
        ]:
            return Response(
                "You can't take responsibility",
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = NightResponsibilitySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UpdateNightResponsibilityView(APIView):
    """View for updating a NightResponsibility object at <baseurl>/api/ykv/update_responsibility/<responsibility.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
            AVAIMELLINEN
        ]:
            return Response(
                "You can't edit this",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            responsibility_to_update = NightResponsibility.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("Not found", status=status.HTTP_404_NOT_FOUND)
            
        responsibility = NightResponsibilitySerializer(
            instance=responsibility_to_update, data=request.data, partial=True
        )

        if responsibility.is_valid():
            responsibility.save()
            return Response(responsibility.data, status=status.HTTP_200_OK)
        return Response(responsibility.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutNightResponsibilityView(APIView):
    """View for logout for NightResponsibility object at <baseurl>/api/ykv/logout_responsibility/<responsibility.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
            AVAIMELLINEN
        ]:
            return Response(
                "You can't edit this",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            responsibility_to_update = NightResponsibility.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("Not found", status=status.HTTP_404_NOT_FOUND)

        logout_time = request.data.get("logout_time")
        if not logout_time:
            return Response("Logout time not provided", status=status.HTTP_400_BAD_REQUEST)

        # Check if logout is later than 7.15
        limit = datetime.now().replace(hour=7, minute=15)
        datetime_format = "%Y-%m-%d %H:%M"
        logout_time = datetime.strptime(request.data["logout_time"], datetime_format)

        if logout_time > limit:
            request.data["late"] = True
        else:
            request.data["late"] = False

        request.data["present"] = False
            
        responsibility = NightResponsibilitySerializer(
            instance=responsibility_to_update, data=request.data, partial=True
        )

        if responsibility.is_valid():
            responsibility.save()
            return Response(responsibility.data, status=status.HTTP_200_OK)
        return Response(responsibility.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetDatabaseView(APIView):
    """View for resetting a database during Cypress tests"""

    def post(self, request):

        """
        Post requests are only accepted if the CYPRESS env.variable is "True"
        or if a Github workflow is running
        """
        if os.getenv("CYPRESS") in ["True"] or os.environ.get("GITHUB_WORKFLOW"):
            User.objects.all().delete()

            return Response("Resetting database successful", status=status.HTTP_200_OK)
        
        return Response(
            "This endpoint is for Cypress tests only",
            status=status.HTTP_403_FORBIDDEN
        )
