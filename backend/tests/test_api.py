from django.test import TestCase
from rest_framework.serializers import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from ilotalo.models import User, Organization, Event
from datetime import datetime, timedelta

"""
These tests are related to the API between frontend and backend
"""


class TestDjangoAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a mock Tavallinen user for testing
        self.data = {
            "username": "klusse",
            "password": "vahvaSalasana1234",
            "email": "klusse.osoite@gmail.com",
            "telegram": "klussentg",
            "role": 5,
            "organization": {
                "TKO-äly": False,
                "Matrix": False
            },
            "keys": {
                "TKO-äly": False,
                "Matrix": False
            },
            "rights_for_reservation": True
        }

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data=self.data,
            format="json",
        )
        self.tavallinen_id = response.data["id"]

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
            "organization": None,
            "keys": None,
            "rights_for_reservation": True
        }

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data=leppispj_data,
            format="json",
        )

        self.leppis_id = response.data["id"]

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

        # Create a mock Muokkaus user for testing
        muokkaus_data = self.data = {
            "username": "Muokkaus",
            "password": "vahvaSalasana1234",
            "email": "muokkaus@gmail.com",
            "telegram": "muokkaus",
            "role": 3,
            "organization": {
                "TKO-äly": False,
                "Matrix": False
            },
            "keys": {
                "TKO-äly": False,
                "Matrix": True
            },
            "rights_for_reservation": True
        }

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data=muokkaus_data,
            format="json",
        )

        self.muokkaus_id = response.data["id"]

        response = self.client.post(
            "http://localhost:8000/api/token/",
            data={"email": "muokkaus@gmail.com", "password": "vahvaSalasana1234"},
            format="json",
        )
        self.muokkaus_access_token = response.data["access"]
        self.muokkaus_refresh_token = response.data["refresh"]

        response = self.client.get(
            "http://localhost:8000/api/users/userinfo",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
        )

        self.muokkaus = response.data
        self.muokkaus_user = self.muokkaus

        # Create a mock Avaimellinen user for testing
        avaimellinen_data = self.data = {
            "username": "Avaimellinen",
            "password": "vahvaSalasana1234",
            "email": "avaimellinen@gmail.com",
            "telegram": "avaimellinen",
            "role": 4,
            "organization": {
                "TKO-äly": False,
                "Matrix": False
            },
            "keys": {
                "TKO-äly": False,
                "Matrix": False
            },
            "rights_for_reservation": True
        }

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data=avaimellinen_data,
            format="json",
        )

        self.avaimellinen_id = response.data["id"]

        response = self.client.post(
            "http://localhost:8000/api/token/",
            data={"email": "avaimellinen@gmail.com", "password": "vahvaSalasana1234"},
            format="json",
        )
        self.avaimellinen_access_token = response.data["access"]
        self.avaimellinen_refresh_token = response.data["refresh"]

        response = self.client.get(
            "http://localhost:8000/api/users/userinfo",
            headers={"Authorization": f"Bearer {self.avaimellinen_access_token}"},
        )

        self.avaimellinen = response.data
        self.avaimellinen_user = self.avaimellinen

        # Create a mock JarjestoPJ user for testing
        jarjestopj_data = self.data = {
            "username": "JarjestoPJ",
            "password": "vahvaSalasana1234",
            "email": "jarjestopj@gmail.com",
            "telegram": "jarjestopj",
            "role": 6,
            "organization": {
                "TKO-äly": False,
                "Matrix": False
            },
            "keys": {
                "TKO-äly": False,
                "Matrix": False
            },
            "rights_for_reservation": True
        }

        response = self.client.post(
            "http://localhost:8000/api/users/register",
            data=jarjestopj_data,
            format="json",
        )

        self.jarjestopj_id = response.data["id"]

        response = self.client.post(
            "http://localhost:8000/api/token/",
            data={"email": "jarjestopj@gmail.com", "password": "vahvaSalasana1234"},
            format="json",
        )
        self.jarjestopj_access_token = response.data["access"]
        self.jarjestopj_refresh_token = response.data["refresh"]

        response = self.client.get(
            "http://localhost:8000/api/users/userinfo",
            headers={"Authorization": f"Bearer {self.jarjestopj_access_token}"},
        )

        self.jarjestopj = response.data
        self.jarjestopj_user = self.jarjestopj

        self.user_count = 5

    def test_user_has_correct_key_list(self):
        """A new user receives a list of Matlu organizations for key management"""

        self.assertEqual(len(self.leppispj["keys"]), 13)
        self.assertEqual(list(self.leppispj["keys"].keys()).index("HYK"), 0)

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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
                "organization": {
                    "TKO-äly": False,
                    "Matrix": False
                },
                "keys": {
                    "TKO-äly": False,
                    "Matrix": False
                }
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
        """Backend responds with 400 if a user is not found when updating information"""

        # update the telegram name
        response = self.client.put(
            "http://localhost:8000/api/users/update/123/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_updating_as_leppispj(self):
        """LeppisPJ can update all users"""

        user_id = User.objects.all()[2].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telegram"], "newtg")
    
    def test_updating_as_muokkaus_tavallinen(self):
        """Muokkaus users can update role 4 and 5 users if they belong to same organization"""

        # First add the users to same organization
        self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        self.client.put(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.tavallinen_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )
        self.client.put(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )

        response = self.client.put(
            f"http://localhost:8000/api/users/update/{self.muokkaus_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telegram"], "newtg")
    
    def test_updating_as_muokkaus_avaimellinen(self):
        """Muokkaus users can update role 4 and 5 users if they belong to same organization"""

        # First add the users to same organization
        self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        self.client.put(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.avaimellinen_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )
        self.client.put(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )

        user_id = User.objects.all()[3].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telegram"], "newtg")
    
    def test_updating_as_muokkaus_invalid_user(self):
        """Muokkaus users can update role 4 and 5 users if they belong to same organization"""

        # First add the users to same organization
        organization_created = self.client.post(
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

        org_id = organization_created.data['id']
        self.client.post(
            "http://localhost:8000/api/organizations/add_user_organization",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"user_id": self.leppis_id, "organization_id":org_id},
            format="json",
        )
        self.client.post(
            "http://localhost:8000/api/organizations/add_user_organization",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"user_id": self.muokkaus_id, "organization_id": org_id},
            format="json",
        )

        # try to update leppispj instead of avaimellinen
        user_id = User.objects.all()[1].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_updating_different_organization_as_muokkaus(self):
        """Muokkaus users can update role 4 and 5 users if they belong to same organization"""

        # First add the users to different organizations
        organization_created = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        organization_created2 = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "TKO-äly",
                "email": "tkoaly@gmail.com",
                "homepage": "tkoaly.fi",
                "size": 1,
            },
            format="json",
        )

        self.client.post(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.tavallinen_id}",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )
        self.client.post(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "TKO-äly"},
            format="json",
        )

        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_updating_notfound_muokkaus(self):
        """Muokkaus users can update role 4 and 5 users if they belong to same organization"""

        # try to update user that doesn't exist
        response = self.client.put(
            f"http://localhost:8000/api/users/update/10/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_updating_notfound_leppispj(self):
        """LeppisPJ can update all users"""

        # try to update user that doesn't exist
        response = self.client.put(
            f"http://localhost:8000/api/users/update/10/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_updating_invalid_tg_as_muokkaus(self):
        """Muokkaus users can update role 4 and 5 users if they belong to same organization"""

        # try to update telegram with already owned name
        user_id = User.objects.all()[3].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"telegram": "klussentg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.avaimellinen["telegram"], "avaimellinen")
    
    def test_updating_invalid_tg_as_leppispj(self):
        """LeppisPJ can update all users"""

        # try to update telegram with already owned name
        user_id = User.objects.all()[2].id
        response = self.client.put(
            f"http://localhost:8000/api/users/update/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"telegram": "klussentg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.muokkaus["telegram"], "muokkaus")

    def test_creating_organization(self):
        """Only LeppisPJ can create a new organization"""

        # create an organization as LeppisPJ with wrong email
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

        # with correct email
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
    
    def test_create_event_no_rights(self):
        """An authorized user can create an event"""

        # change the reservation rights to false
        user = User.objects.get(id=self.leppis_id)
        user.rights_for_reservation = False
        user.save()

        # try to create an event
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

        self.assertEqual(event_created.status_code, status.HTTP_400_BAD_REQUEST)
    
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
    
    def test_update_room_no_rights(self):
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

        # change the reservation rights to false
        user = User.objects.get(id=self.leppis_id)
        user.rights_for_reservation = False
        user.save()

        # try to update an event
        event_id = event_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/events/update_event/{event_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"room": "Pelihuone"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_delete_event_no_rights(self):
        """An authorized user can update event room"""

        # first create an event to delete it
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

        # change the reservation rights to false
        user = User.objects.get(id=self.leppis_id)
        user.rights_for_reservation = False
        user.save()

        # try to delete an event
        event_id = event_created.data['id']
        response = self.client.delete(
            f"http://localhost:8000/api/events/delete_event/{event_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
    
        # try delete event that doesn't exist
        response = self.client.delete(
            f"http://localhost:8000/api/events/delete_event/10/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
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
            f"http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00"
            },
            format="json",
        )

        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/update_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"responsible_for": "tietyt vieraat"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["responsible_for"], "tietyt vieraat")
  
    def test_ykv_logout(self):
        """An authorized user can logout ykv"""

        # test logout on the next day 
        current_time = datetime.now()
        logout_time = current_time.replace(hour=7, minute=0)
        login_time = logout_time - timedelta(days=1)
        login_time = login_time.replace(hour=19, minute=15)

        # first create an ykv
        ykv_created = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": login_time.strftime("%Y-%m-%d %H:%M")
            },
            format="json",
        )

        # before 7.15 logout
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"logout_time": logout_time.strftime("%Y-%m-%d %H:%M")},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["late"], False)
    
    def test_ykv_late_logout(self):
        """An authorized user can logout ykv"""

        current_time = datetime.now()
        logout_time = current_time.replace(hour=7, minute=30)
        login_time = logout_time - timedelta(days=1)
        login_time = login_time.replace(hour=19, minute=15)

        # first create an ykv
        ykv_created = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": login_time.strftime("%Y-%m-%d %H:%M")
            },
            format="json",
        )

        # late logout
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"logout_time": logout_time.strftime("%Y-%m-%d %H:%M")},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["late"], True)
    
    def test_logout_ykv_notfound(self):
        # try to logout ykv that don't exist
        current_time = datetime.now()
        logout_time = current_time.replace(hour=7, minute=30)

        response = self.client.put(
            f"http://localhost:8000/api/ykv/logout_responsibility/2/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"logout_time": logout_time.strftime("%Y-%m-%d %H:%M")},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_logout_ykv_role5(self):
        """An authorized user can logout ykv"""

        current_time = datetime.now()
        logout_time = current_time.replace(hour=7, minute=30)

        # first create ykv
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

        # try to logout ykv with role 5 user
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"logout_time": logout_time.strftime("%Y-%m-%d %H:%M")},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ykv_created.data["logout_time"], "1970-01-02T14:00:00Z")
    
    def test_logout_ykv_empty(self):
        """An authorized user can logout ykv"""

        # first create an ykv
        ykv_created = self.client.post(
            f"http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00"
            },
            format="json",
        )

        # try logout_time with empty
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Logout time not provided")
    
    def test_logout_ykv_invalid(self):
        """An authorized user can logout ykv"""

        # first create an ykv
        ykv_created = self.client.post(
            f"http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00"
            },
            format="json",
        )

        # try logout_time with empty
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"responsible_for": "vip vieraat"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ykv_created.data["responsible_for"], "kutsutut vieraat")

        current_time = datetime.now()
        logout_time = current_time.replace(hour=7, minute=0)

        # attempt changing the email address to an invalid one
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "email": "badaddress@",
                "logout_time": logout_time.strftime("%Y-%m-%d %H:%M")
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_ykv_notfound(self):
        # try to update ykv that don't exist
        response = self.client.put(
            f"http://localhost:8000/api/ykv/update_responsibility/2/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"responsible_for": "tietyt vieraat"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_update_ykv_role5(self):
        """An authorized user can update ykv"""

        # first create ykv
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
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/update_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"responsible_for": "tietyt vieraat"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ykv_created.data["responsible_for"], "kutsutut vieraat")
    
    def test_update_ykv_invalid(self):
        """An authorized user can logout ykv"""

        # first create an ykv 
        ykv_created = self.client.post(
            f"http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "username": "matti",
                "email": "matti@hotmail.com",
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00"
            },
            format="json",
        )

        # try to update responsible_for with empty
        ykv_id = ykv_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/ykv/update_responsibility/{ykv_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"responsible_for": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ykv_created.data["responsible_for"], "kutsutut vieraat")
    
    def test_update_organization(self):
        """An authorized user can update organization"""

        # first create an organization to update it
        organization_created = self.client.post(
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

        # update the homepage
        org_id = organization_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/organizations/update_organization/{org_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"homepage": "matrix.fi"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["homepage"], "matrix.fi")
    
    def test_update_organization_invalid(self):
        """An authorized user can update organization"""

        # first create an organization to update it
        organization_created = self.client.post(
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

        # update the homepage with invalid parameter
        org_id = organization_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/organizations/update_organization/{org_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"homepage": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(organization_created.data["homepage"], "matrix-ry.fi")
    
    def test_update_with_nonexistentorganization(self):
        """An authorized user can update organization"""

        # update hompage with organization that doesn't exist
        response = self.client.put(
            f"http://localhost:8000/api/organizations/update_organization/2/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"homepage": "matrix.fi"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_update_organization_role5(self):
        """An authorized user can update organization"""

       # first create an organization to update it
        organization_created = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )
        # try to update the homepage with role 5 user
        org_id = organization_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/organizations/update_organization/{org_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"homepage": "matrix.fi"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(organization_created.data["homepage"], "matrix-ry.fi")
    
    def test_updating_organization_role3(self):
        """An authorized user can update organization"""

        # first create an organization to update it
        organization_created = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        # add user to created organization
        user = User.objects.get(email="muokkaus@gmail.com")
        
        self.client.put(
            f"http://localhost:8000/api/organizations/add_user_organization/{user.id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "organization_name": "Matrix"
            },
            format="json",
        )

        # update the homepage with role3 user
        org_id = organization_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/organizations/update_organization/{org_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"homepage": "matrix.fi"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["homepage"], "matrix.fi")
    
    def test_updating_organization_role3_invalid(self):
        """An authorized user can update organization"""

        # first create an organization to update it
        organization_created = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        # try update the homepage of organization that user isn't member of
        org_id = organization_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/organizations/update_organization/{org_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"homepage": "matrix.fi"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(organization_created.data["homepage"], "matrix-ry.fi")
    
    def test_add_user_organization(self):
        """An authorized user can add member to organization"""

        # first create an organization to add member to it
        self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        # add user to created organization
        response = self.client.put(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        muokkaus_user = User.objects.get(id=self.muokkaus_user['id'])
        self.assertTrue(muokkaus_user.organization['Matrix'])
    
    def test_add_user_organization_role5(self):
        """An authorized user can add member to organization"""

        # first create an organization to add member to it
        organization_created = self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 1,
            },
            format="json",
        )

        # try to add user to created organization with role5 user
        response = self.client.put(
            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"organization_name": "Matrix"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_add_user_organization_invalid_user(self):
        """An authorized user can add member to organization"""

        # first create an organization to add member to it
        organization_created = self.client.post(
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

        # try to add non-existent user to created organization
        org_id = organization_created.data['id']
        response = self.client.post(
            "http://localhost:8000/api/organizations/add_user_organization",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"user_id": 5, "organization_id": org_id},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_add_user_organization_invalid_org(self):
        """An authorized user can add member to organization"""

        # try to add user to non-existent organization
        response = self.client.post(
            "http://localhost:8000/api/organizations/add_user_organization",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"user_id": self.muokkaus_user["id"], "organization_id": 10},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_change_rights_reservation(self):
        """An authorized user can change the rights for reservation"""

        # change Muokkaus user rights from true to false as Jarjestopj user
        user_id = User.objects.all()[2].id
        response = self.client.put(
            f"http://localhost:8000/api/users/change_rights_reservation/{user_id}/",
            headers={"Authorization": f"Bearer {self.jarjestopj_access_token}"},
            data={"rights_for_reservation": False},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["rights_for_reservation"], False)
    
    def test_change_rights_reservation_as_tavallinen(self):
        """An authorized user can change the rights for reservation"""

        # try to change the rights of Muokkaus user as Tavallinen user
        user_id = User.objects.all()[2].id
        response = self.client.put(
            f"http://localhost:8000/api/users/change_rights_reservation/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"rights_for_reservation": False},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.muokkaus_user["rights_for_reservation"], True)
    
    
    def test_change_rights_reservation_notfound(self):
        """An authorized user can change the rights for reservation"""

        # try to change the rights of an user that doesn't exist
        response = self.client.put(
            f"http://localhost:8000/api/users/change_rights_reservation/10/",
            headers={"Authorization": f"Bearer {self.jarjestopj_access_token}"},
            data={"rights_for_reservation": False},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_change_rights_reservation_invalid(self):
        """An authorized user can change the rights for reservation"""

        # try to change the rights with invalid input
        user_id = User.objects.all()[2].id
        response = self.client.put(
            f"http://localhost:8000/api/users/change_rights_reservation/{user_id}/",
            headers={"Authorization": f"Bearer {self.jarjestopj_access_token}"},
            data={"rights_for_reservation": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.muokkaus_user["rights_for_reservation"], True)
    
    def test_hand_over_key_valid(self):
        """A user with permission can hand over a Klusteri key"""
        
        # Hand over a key to a regular user with LeppisPJ
        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["keys"]["Matrix"])
    
    def test_hand_over_key_invalid(self):
        """Everything that can go wrong with handing over a Klusteri key"""

        # Attempt handing over a key without permission
        user_id = User.objects.all()[1].id
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "No permission for handing over a key")
        
        # Attempt handing over a key to a nonexistent user
        user_id = 2500000
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "Matrix"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, "User not found")

        # Forget to include organization_name in the request
        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"my_name_is": "Marshall"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Provide the name of the organization")

        # Attempt handing over a Klusteri key of a nonexistent organization
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "RocketScientists"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, "Organization not found")

        # Attempt including additional data to the request
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "organization_name": "Matrix",
                "email": "newemail@gmail.com"
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "You can only hand over a Klusteri key through this endpoint")
