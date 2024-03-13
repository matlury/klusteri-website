from django.test import TestCase
from rest_framework.serializers import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from ilotalo.models import User, Organization, Event

"""
These tests are related to the API between frontend and backend
"""


class TestDjangoAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a mock normal user for testing
        self.data = {
            "username": "klusse",
            "password": "vahvaSalasana1234",
            "email": "klusse.osoite@gmail.com",
            "telegram": "klussentg",
            "role": 5,
        }

        self.client.post(
            "http://localhost:8000/api/users/register",
            data=self.data,
            format="json",
        )

        response = self.client.post(
            "http://localhost:8000/api/token/",
            data={"email": "klusse.osoite@gmail.com", "password": "vahvaSalasana1234"},
            format="json",
        )
        self.access_token = response.data["access"]
        self.refresh_token = response.data["refresh"]

        response = self.client.get(
            "http://localhost:8000/api/users/userinfo",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        self.user = response.data

        # Create a mock LeppisPJ for testing
        leppispj_data = self.data = {
            "username": "LeppisPJ",
            "password": "vahvaSalasana1234",
            "email": "leppispj@gmail.com",
            "telegram": "tgleppispj",
            "role": 1,
        }

        self.client.post(
            "http://localhost:8000/api/users/register",
            data=leppispj_data,
            format="json",
        )

        response = self.client.post(
            "http://localhost:8000/api/token/",
            data={"email": "leppispj@gmail.com", "password": "vahvaSalasana1234"},
            format="json",
        )
        self.leppis_access_token = response.data["access"]
        self.leppis_refresh_token = response.data["refresh"]

        response = self.client.get(
            "http://localhost:8000/api/users/userinfo",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
        )

        self.leppispj = response.data
        self.user_count = 2

    def test_creating_user(self):
        """A new user can be created if the parameters are valid"""

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "domustg",
                "role": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)

    def test_create_two_users_with_blank_telegram(self):
        """
        Creating multiple users with no telegram name should be possible.
        Telegram names should be unique and therefore django might consider Null=Null.
        """

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "",
                "role": 5,
            },
            format="json",
        )

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "regina",
                "password": "vahvaSalasana1234",
                "email": "gaudium.regina@gmail.com",
                "telegram": "",
                "role": 5,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 2)

    def test_creating_user_with_username_too_long(self):
        """A new user can't be posted to /users/ if the username is too long"""

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christinareginadomusgaudium",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "domustg",
                "role": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), self.user_count)

    def test_creating_user_with_password_too_common(self):
        """A new user can't be posted to /users/ if the password is too long"""

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "password",
                "email": "regina.gaudium@gmail.com",
                "telegram": "domustg",
                "role": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), self.user_count)

    def test_delete_user(self):
        """A user can be deleted"""
        
        # When running the entire test suite, a hard coded id in the url will cause a 404 response
        # The following way works like intended
        user_id = User.objects.all()[0].id
        response = self.client.delete(f"http://localhost:8000/api/listobjects/users/{user_id}/", format="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), self.user_count-1)

    def test_register_user_with_duplicate(self):
        """Creating a user fails if their telegram name is taken"""

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "klussentg",
                "role": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), self.user_count)

    def test_fetch_user_data_with_token(self):
        """User data can be fetched with an access token"""

        # get the web tokens
        tokens = self.client.post(
            "http://localhost:8000/api/token/",
            data={"email": "klusse.osoite@gmail.com", "password": "vahvaSalasana1234"},
            format="json",
        )
        access_token = tokens.data["access"]

        # fetch the data
        response = self.client.get(
            "http://localhost:8000/api/users/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "klusse.osoite@gmail.com")
        self.assertEqual(response.data["telegram"], "klussentg")

    def test_get_new_access_token(self):
        """A new access token can be generated with a refresh token"""

        # get a new access token
        response = self.client.post(
            "http://localhost:8000/api/token/refresh/",
            data={"refresh": f"{self.refresh_token}"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["access"].startswith("eyJhbGciOiJIUzI"))

    def test_update_email_address(self):
        """An authorized user can update their email address"""

        # update the email address
        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"email": "uusisp@gmail.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "uusisp@gmail.com")

    def test_updating_email_with_invalid_parameters(self):
        """Updating an email fails without authorization or if the new address is invalid"""

        # attempt updating without authorization
        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            data={"email": "uusisp@gmail.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.user["email"], "klusse.osoite@gmail.com")

        # new email address is invalid
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"email": "uusisp"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.user["email"], "klusse.osoite@gmail.com")

    def test_updating_email_with_taken_address(self):
        """Updating an email address fails if the address is taken"""
        
        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "tguser",
                "role": 5,
            },
            format="json",
        )

        user_id = response.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/", 
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"email": "klusse.osoite@gmail.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertRaises(ValidationError)
        self.assertEqual(self.user["email"], "klusse.osoite@gmail.com")

    def test_updating_telegram_with_invalid_parameters(self):
        """Updating a telegram name fails without authorization or if the new name is taken"""

        # attempt updating without authorization
        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            data={"telegram": "newtelegram"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.user["telegram"], "klussentg")

        # telegram name is taken
        self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "tguser",
                "role": 5,
            },
            format="json",
        )

        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": "tguser"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.user["telegram"], "klussentg")

    def test_updating_telegram_name(self):
        """An authorized user can update their telegram name"""

        # update the telegram name
        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telegram"], "newtg")

        # telegram can be removed
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telegram"], "")

    def test_updating_non_existent_user(self):
        """Backend responds with 404 if a user is not found when updating information"""

        # update the telegram name
        response = self.client.put(
            "http://localhost:8000/api/users/update/123/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_creating_organization(self):
        """Only LeppisPJ can create a new organization"""

        # create an organization as LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix Ry",
                "email": "matrix_ry@gmail",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix Ry",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # creating an organization fails if the user is not LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
                "name": "TKO-Äly Ry",
                "email": "tkoaly_ry@gmail.com",
                "homepage": "tko_aly.fi",
                "size": 1,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_removing_organization(self):
        """Only LeppisPJ can remove an organization"""

        # create an organization as LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix Ry",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # deleting the organization fails if the user is not LeppisPJ
        organization_id = response.data['id']
        response = self.client.delete(
            f"http://localhost:8000/api/organizations/remove/{organization_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # delete the organization as LeppisPJ
        response = self.client.delete(
            "http://localhost:8000/api/organizations/remove/123/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.delete(
            f"http://localhost:8000/api/organizations/remove/{organization_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_creating_event(self):
        """Only role < 5 can create a new event"""

        # create an event as LeppisPJ with empty description
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "varasto",
                "reservation": "varaus",
                "description": "",
                "responsible": "Matti",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "varasto",
                "reservation": "varaus",
                "description": "kahvihetki",
                "responsible": "Matti",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # creating an event fails if the user is not LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
                "room": "varasto",
                "reservation": "varaus",
                "description": "kahvihetki",
                "responsible": "Matti",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_room(self):
        """An authorized user can update event room"""

        # first create an event to update it
        event_created = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "reservation": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        # update the room
        event_id = event_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/events/update_event/{event_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"room": "Toinen huone"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room"], "Toinen huone")
    
    def test_update_room_invalid(self):
        """An authorized user can update event room"""

        # first create an event to update it
        event_created = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "reservation": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        # update the room with invalid parameter
        event_id = event_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/events/update_event/{event_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"room": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(event_created.data["room"], "Kattilahuone")
    
    def test_update_with_nonexistentevent(self):
        """An authorized user can update event room"""

        # update a room in an event that doesn't exist
        response = self.client.put(
            "http://localhost:8000/api/events/update_event/1/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"room": "Kattohuoneisto"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_update_room_role5(self):
        """An authorized user can update event room"""

        # first create an event to update it
        event_created = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "reservation": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        # try to update the room with role 5 user
        response = self.client.put(
            "http://localhost:8000/api/events/update_event/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"room": "Kattohuoneisto"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(event_created.data["room"], "Kattilahuone")

    def test_deleting_event(self):
        """LeppisPJ can delete an event"""

        # create an event as LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "varasto",
                "reservation": "varaus",
                "description": "kahvihetki",
                "responsible": "Matti",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        event_id = response.data['id']

        # delete the event as LeppisPJ
        response = self.client.delete(
            f"http://localhost:8000/api/events/delete_event/{event_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # create an event as LeppisPJ to ensure deletion was successful
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "varasto",
                "reservation": "varaus",
                "description": "kahvihetki",
                "responsible": "Matti",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        event_id = response.data['id']

        # deleting an event fails if the user is not LeppisPJ
        response = self.client.delete(
            f"http://localhost:8000/api/events/delete_event/{event_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_creating_ykv(self):
        """Only role < 5 can create a new ykv (night responsibility)"""

        # create an ykv as LeppisPJ with empty responsible_for
        response = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # creating an ykv fails if the user is not LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
               "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_ykv(self):
        """An authorized user can update ykv"""

        # first create an ykv to update it
        ykv_created = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00"
            },
            format="json",
        )

        response = self.client.put(
            "http://localhost:8000/api/ykv/update_responsibility/1/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"responsible_for": "tietyt vieraat", "logout_time": "1970-01-01T13:00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["responsible_for"], "tietyt vieraat")
    
    def test_ykv_logout(self):
        """An authorized user can update ykv"""

        # first create an ykv
        ykv_created = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "2024-03-05T18:00"
            },
            format="json",
        )

        # not late logout
        response = self.client.put(
            "http://localhost:8000/api/ykv/update_responsibility/1/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"logout_time": "2024-03-05T23:00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["late"], False)
    
    def test_ykv_late_logout(self):
        """An authorized user can update ykv"""

        # first create an ykv
        ykv_created = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "2024-03-06T20:00"
            },
            format="json",
        )

        # late logout
        response = self.client.put(
            "http://localhost:8000/api/ykv/update_responsibility/1/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"logout_time": "2024-03-07T07:30"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["late"], True)
    
    def test_update_ykv_role5(self):
        """An authorized user can update ykv"""

        # first create ykv to update it
        ykv_created = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False
            },
            format="json",
        )

        # try to update ykv with role 5 user
        response = self.client.put(
            "http://localhost:8000/api/ykv/update_responsibility/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"responsible_for": "tietyt vieraat"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ykv_created.data["responsible_for"], "kutsutut vieraat")
    