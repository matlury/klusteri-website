import os
import requests
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Count
from .serializers import (
    UserSerializer,
    OrganizationSerializer,
    UserNoPasswordSerializer,
    UserUpdateSerializer,
    EventSerializer,
    CreateEventSerializer,
    NightResponsibilitySerializer,
    CreateNightResponsibilitySerializer,
    DefectFaultSerializer,
    CleaningSerializer,
    CreateCleaningSerializer,
)
from .models import User, Organization, Event, NightResponsibility, DefectFault, Cleaning
from .config import Role
from datetime import datetime, timezone
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

LEPPISPJ = Role.LEPPISPJ.value
LEPPISVARAPJ = Role.LEPPISVARAPJ.value
MUOKKAUS = Role.MUOKKAUS.value
AVAIMELLINEN = Role.AVAIMELLINEN.value
TAVALLINEN = Role.TAVALLINEN.value
JARJESTOPJ = Role.JARJESTOPJ.value
JARJESTOVARAPJ = Role.JARJESTOVARAPJ.value

# Get reCAPTCHA secret key from environment variables, use the testing key if not found
recaptcha_secret_key = os.getenv("RECAPTCHA_SECRET_KEY", "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe")

"""
Views receive web requests and return web responses.
More info: https://www.django-rest-framework.org/api-guide/views/
"""


class UserView(viewsets.ReadOnlyModelViewSet):
    """
    Displays a list of all User objects at <baseurl>/users/
    Only supports list and retrieve actions (read-only)
    """

    serializer_class = UserNoPasswordSerializer
    queryset = User.objects.all()


class OrganizationView(viewsets.ReadOnlyModelViewSet):
    """
    Displays a list of all Organization objects at <baseurl>/organizations/
    Only supports list and retrieve actions (read-only)
    """

    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()


class RegisterView(APIView):
    """View for creating a new user at <baseurl>/api/users/register/"""

    def post(self, request):
        data = request.data
        recaptcha_response = data.pop('recaptcha_response', None)
        serializer = UserSerializer(data=data)

        # Check if the request contains valid data
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        google_response = requests.post('https://www.google.com/recaptcha/api/siteverify', data={
            'secret': recaptcha_secret_key,
            'response': recaptcha_response,
        })

        # Check if the request to Google's API was successful
        if not google_response.json().get('success'):
            return Response({'recaptcha': 'Invalid or expired reCAPTCHA.'}, status=status.HTTP_400_BAD_REQUEST)

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

        # Leppispj and Leppisvarapj can edit all users
        if user.data["role"] in [LEPPISPJ, LEPPISVARAPJ]:
            try:
                user_to_update = User.objects.get(id=pk)
            except ObjectDoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)

            user = UserUpdateSerializer(
                instance=user_to_update, data=request.data, partial=True
            )
            if user.is_valid():
                user.save()
                return Response(user.data, status=status.HTTP_200_OK)
            return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

        # Muokkaus users can only edit users that have role 4 or 5 and belong to the same organization
        elif user.data["role"] == MUOKKAUS:
            try:
                user_to_update = User.objects.get(id=pk)
            except ObjectDoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)

            if user_to_update.role in [AVAIMELLINEN, TAVALLINEN]:
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

class RemoveUserView(APIView):
    """View for removing an user <baseurl>/api/users/delete_user/<int:pk>/"""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        user = UserSerializer(request.user)

        if user.data["role"] not in [LEPPISPJ, LEPPISVARAPJ]:
            return Response(
                "You can't remove users",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_to_remove = User.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response(
                "User not found", status=status.HTTP_404_NOT_FOUND
            )

        user_to_remove.delete()

        return Response(f"User {user_to_remove.username} successfully removed", status=status.HTTP_200_OK)

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
    """
    View for removing an organization <baseurl>/api/organizations/remove/<int:pk>/.
    Also removes keys and memberships from users.
    """

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

        return Response(
            f"Organization {organization_to_remove.name} successfully removed",
            status=status.HTTP_200_OK
        )


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
            if organization and request.user.organization[organization.name]:
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
    View for adding a User to an Organization at <baseurl>/api/organizations/add_user_organization/<user.id>/
    Only Leppispj and Leppisvarapj can add users to organizations for now, data needed to add user
    to organization: user id and organization id
    """
#    permission_classes = [permissions.IsAuthenticated]
#
#    def put(self, request, pk=None):
#        """
#        Request for adding a user to an organization
#
#        Parameters
#        ----------
#        request: dict
#            Contains the name of the organization in which the user will be added
#            {
#                "organization_name": "Matrix"
#            }
#
#        pk (primary key): str
#            Id of the user about to be added to the organization
#        """
#
#        user = UserSerializer(request.user)
#
#        if user.data["role"] not in [
#            LEPPISPJ,
#            LEPPISVARAPJ
#        ]:
#            return Response(
#                "You can't add members to organizations",
#                status=status.HTTP_400_BAD_REQUEST,
#            )
#
#        try:
#            user_to_update = User.objects.get(id=pk)
#            organization_name = request.data["organization_name"]
#        except ObjectDoesNotExist:
#            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
#        except KeyError:
#            return Response(
#                "Provide the name of the organization",
#                status=status.HTTP_400_BAD_REQUEST
#            )
#
#        # Check if the request contains unwanted data
#        if (len(request.data.keys())) > 1:
#            return Response(
#                "You can only add a user to an organization through this endpoint",
#                status=status.HTTP_400_BAD_REQUEST
#            )
#
#
#        # Update the user's key list
#        users_organizations = user_to_update.organization
#        users_organizations[organization_name] = True
#
#        serializer = UserUpdateSerializer(
#            instance=user_to_update, data=users_organizations, partial=True
#        )
#
#        if serializer.is_valid():
#            serializer.save()
#            return Response(serializer.data, status=status.HTTP_200_OK)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    pass

class EventView(viewsets.ReadOnlyModelViewSet):
    """
    Displays a list of all Event objects at <baseurl>/events/
    Only supports list and retrieve actions (read-only)
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
            JARJESTOPJ,
            JARJESTOVARAPJ
        ] and user.data["rights_for_reservation"] is False:
            return Response(
                "You can't add an event",
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CreateEventSerializer(data=request.data)

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

        try:
            event_to_remove = Event.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response(
                "Event not found", status=status.HTTP_404_NOT_FOUND
            )
        
        if not (user.data["role"] in [LEPPISPJ, LEPPISVARAPJ] or user.data["id"] == event_to_remove.created_by.id):
            return Response(
                "You can't remove the event",
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_to_remove.delete()

        return Response(
            f"Event {event_to_remove.title} successfully removed",
            status=status.HTTP_200_OK
        )

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
            AVAIMELLINEN,
            JARJESTOPJ,
            JARJESTOVARAPJ
        ] and user.data["rights_for_reservation"] is False:
            return Response(
                "Users with role 5 can't edit events",
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

class NightResponsibilityView(viewsets.ReadOnlyModelViewSet):
    """
    Displays a list of all NightResponsibility objects at <baseurl>/ykv/
    Only supports list and retrieve actions (read-only)
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
            AVAIMELLINEN,
            JARJESTOPJ
        ]:
            return Response(
                "You can't take responsibility",
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CreateNightResponsibilitySerializer(data=request.data)

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
            AVAIMELLINEN,
            JARJESTOPJ
        ]:
            return Response(
                "You can't edit this",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            responsibility_to_update = NightResponsibility.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("Not found", status=status.HTTP_404_NOT_FOUND)

        if responsibility_to_update.user_id == user.data["id"] or responsibility_to_update.created_by == user.data["username"]:
            pass
        else:
            return Response(
                "Not allowed for this user",
                status=status.HTTP_400_BAD_REQUEST,
            )

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
            AVAIMELLINEN,
            JARJESTOPJ
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

        if responsibility_to_update.user_id == user.data["id"] or responsibility_to_update.created_by == user.data["username"]:
            pass
        else:
            return Response(
                "Not allowed for this user",
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if logout is later than 7.15
        # ATTENTION! Current method is bad and doesn't acknowledge timezones
        limit = datetime.now().replace(hour=5, minute=15)
        datetime_format = "%Y-%m-%d %H:%M"
        logout_time = datetime.strptime(request.data["logout_time"], datetime_format)
        login_time = datetime.strptime(str(responsibility_to_update.login_time)[:-16], datetime_format)

        if (logout_time > limit) and (login_time < limit):
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

class RightsForReservationView(APIView):
    """View for changing the rights for making events at <baseurl>/api/users/change_rights_reservation/<int:pk>/"""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] not in [LEPPISPJ, LEPPISVARAPJ, JARJESTOPJ, JARJESTOVARAPJ]:
            return Response("You can't change the rights", status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                user_to_update = User.objects.get(id=pk)
            except User.DoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)

            data = {
                "rights_for_reservation": not user_to_update.rights_for_reservation
            }

            user_serializer = UserUpdateSerializer(
                instance=user_to_update, data=data, partial=True
            )
            if user_serializer.is_valid():
                user_serializer.save()
                return Response(user_serializer.data, status=status.HTTP_200_OK)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetDatabaseView(APIView):
    """View for resetting a database during Cypress tests"""

    def post(self, request):

        """
        Post requests are only accepted if the CYPRESS env.variable is "True"
        or if a Github workflow is running
        """
        if os.getenv("CYPRESS") in ["True"] or os.environ.get("GITHUB_WORKFLOW"):
            User.objects.all().delete()
            Organization.objects.all().delete()
            NightResponsibility.objects.all().delete()
            Event.objects.all().delete()
            DefectFault.objects.all().delete()

            return Response("Resetting database successful", status=status.HTTP_200_OK)

        return Response(
            "This endpoint is for Cypress tests only",
            status=status.HTTP_403_FORBIDDEN
        )

class HandOverKeyView(APIView):
    """View for handing over a Klusteri key at <baseurl>/api/keys/hand_over_key/<user.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        """
        Request for handing over the key

        Parameters
        ----------
        request: dict
            Contains the name of the organization whose key is being handed over
            {
                "organization_name": "Matrix"
            }

        pk (primary key): str
            Id of the user about to receive the key
        """

        user = UserSerializer(request.user)

        # Make sure the person attempting the key handover is valid
        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS
        ]:
            return Response(
                "No permission for handing over a key",
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the request contains unwanted data
        if (len(request.data.keys())) > 1:
            return Response(
                "You can only hand over a Klusteri key through this endpoint",
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_update = User.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)

        try:
            organization_to_update = Organization.objects.get(name=request.data["organization_name"])
        except ObjectDoesNotExist:
            return Response("Organization not found", status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response("Provide the name of the organization", status=status.HTTP_400_BAD_REQUEST)

        # Update the user's key list
        users_keys = organization_to_update.id

        # Combine updates into a single dictionary
        updated_data = {
            'keys': users_keys,
        }

        # Update the users role if it's 5
        if user_to_update.role == 5:
            updated_data["role"] = 4

        serializer = UserUpdateSerializer(
            instance=user_to_update, data=updated_data, partial=True
        )

        if serializer.is_valid():
            user_to_update.keys.add(organization_to_update)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DefectFaultView(viewsets.ReadOnlyModelViewSet):
    """
    Displays a list of all DefectFault objects at <baseurl>/defects/
    Only supports list and retrieve actions (read-only)
    """

    serializer_class = DefectFaultSerializer
    queryset = DefectFault.objects.all()

class CreateDefectFaultView(APIView):
    """View for creating a new defect/fault report <baseurl>/api/defects/create_defect"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = DefectFaultSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RepairDefectFaultView(APIView):
    """View for updating a DefectFault object at <baseurl>/api/defects/repair_defect/<defect.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
        ]:
            return Response(
                "You can't edit this",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            defect_to_update = DefectFault.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("Not found", status=status.HTTP_404_NOT_FOUND)

        defect_to_update.repaired = datetime.now(timezone.utc)

        defectfault = DefectFaultSerializer(
            instance=defect_to_update, data=request.data, partial=True
        )

        if defectfault.is_valid():
            defectfault.save()
            return Response(defectfault.data, status=status.HTTP_200_OK)
        return Response(defectfault.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailDefectFaultView(APIView):
    """View for updating a DefectFault object at <baseurl>/api/defects/email_defect/<defect.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
        ]:
            return Response(
                "You can't edit this",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            defect_to_update = DefectFault.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("Not found", status=status.HTTP_404_NOT_FOUND)

        defect_to_update.email_sent = datetime.now(timezone.utc)

        defectfault = DefectFaultSerializer(
            instance=defect_to_update, data=request.data, partial=True
        )

        if defectfault.is_valid():
            defectfault.save()
            return Response(defectfault.data, status=status.HTTP_200_OK)
        return Response(defectfault.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateDefectFaultView(APIView):
    """View for updating a DefectFault object at <baseurl>/api/defects/update_defect/<defect.id>/"""

    # IsAuthenticated will deny access if request has no access token
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk=None):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
        ]:
            return Response(
                "You can't edit defects",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            defect_to_update = DefectFault.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response("Not found", status=status.HTTP_404_NOT_FOUND)

        defect = DefectFaultSerializer(
            instance=defect_to_update, data=request.data, partial=True
        )

        if defect.is_valid():
            defect.save()
            return Response(defect.data, status=status.HTTP_200_OK)
        return Response(defect.errors, status=status.HTTP_400_BAD_REQUEST)

class RemoveDefectFaultView(APIView):
    """View for removing a defect <baseurl>/api/defects/delete_defect/<defect.id>/"""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
            LEPPISVARAPJ,
            MUOKKAUS,
            AVAIMELLINEN,
            JARJESTOPJ,
            JARJESTOVARAPJ
        ]:
            return Response(
                "You can't remove defects",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            defect_to_remove = DefectFault.objects.get(id=pk)
        except ObjectDoesNotExist:
            return Response(
                "Defect not found", status=status.HTTP_404_NOT_FOUND
            )
        defect_to_remove.delete()

        return Response(f"Defect {defect_to_remove.description} successfully removed", status=status.HTTP_200_OK)

class CleaningView(viewsets.ReadOnlyModelViewSet):
    """
    Displays a list of all cleaning objects at <baseurl>/cleaning/
    Only supports list and retrieve actions (read-only)
    """

    serializer_class = CleaningSerializer
    queryset = Cleaning.objects.all()

class CreateCleaningView(APIView):
    """View for creating cleaning schedule <baseurl>/api/cleaning/create_cleaning"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
        ]:
          return Response(
                "You can't edit cleaning schedule",
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = CreateCleaningSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if Cleaning.objects.all().count() >= 53:
            return Response({"error": "Cleaning schedule already exist."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RemoveCleaningView(APIView):
    """View for removing the cleaning schedule <baseurl>/api/cleaning/remove/all/"""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = UserSerializer(request.user)

        if user.data["role"] not in [
            LEPPISPJ,
        ]:
            return Response(
                "You can't remove cleaning schedule",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            Cleaning.objects.all().delete()
        except ObjectDoesNotExist:
            return Response(
                "Cleaning data not found", status=status.HTTP_404_NOT_FOUND
            )

        return Response(f"Cleaning schedule successfully removed", status=status.HTTP_200_OK)


def force_logout_ykv_logins():
    try:
        responsibility_to_update = NightResponsibility.objects.filter(present=True)
        if len(responsibility_to_update) == 0:
            return "Nothing to log out"
    except ObjectDoesNotExist:
        return "Nothing to log out"

    datetime_format = "%Y-%m-%d %H:%M"
    logout_time = datetime.strptime(str(datetime.now())[:-10], datetime_format)

    for resp in responsibility_to_update:
        data = {'late': True,
                'present': False, 
                'logout_time': logout_time}
        responsibility = NightResponsibilitySerializer(
            instance=resp, data=data, partial=True
        )
        if responsibility.is_valid():
            responsibility.save()

    return "logged out users"

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
