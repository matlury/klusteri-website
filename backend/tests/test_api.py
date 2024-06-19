from django.test import TestCase
from rest_framework.serializers import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from ilotalo.models import User, Organization, Event
from datetime import datetime, timezone, timedelta
from ilotalo.views import force_logout_ykv_logins

"""
Unit tests for back end features
"""


class TestDjangoAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a mock Tavallinen (role 5) user for testing
        self.data = {
            "username": "klusse",
            "password": "vahvaSalasana1234",
            "email": "klusse.osoite@gmail.com",
            "telegram": "klussentg",
            "role": 5,
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

        # Create a mock LeppisPJ (role 1) for testing
        leppispj_data = self.data = {
            "username": "LeppisPJ",
            "password": "vahvaSalasana1234",
            "email": "leppispj@gmail.com",
            "telegram": "tgleppispj",
            "role": 1,
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

        # Create a mock Muokkaus (role 3) user for testing
        muokkaus_data = self.data = {
            "username": "Muokkaus",
            "password": "vahvaSalasana1234",
            "email": "muokkaus@gmail.com",
            "telegram": "muokkaus",
            "role": 3,
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

        # Create a mock Avaimellinen (role 4) user for testing
        avaimellinen_data = self.data = {
            "username": "Avaimellinen",
            "password": "vahvaSalasana1234",
            "email": "avaimellinen@gmail.com",
            "telegram": "avaimellinen",
            "role": 4,
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

        # Create a mock JarjestoPJ (role 6) user for testing
        jarjestopj_data = self.data = {
            "username": "JarjestoPJ",
            "password": "vahvaSalasana1234",
            "email": "jarjestopj@gmail.com",
            "telegram": "jarjestopj",
            "role": 6,
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


        tko_aly_data = self.data = {
            "email": "tko@aly.fi",
            "homepage": "tko-aly.fi",
            "name": "tko-aly",
            "size": 1
        }

        response = self.client.post(
            "http://localhost:8000/api/organizations/create",
            data=tko_aly_data,
            format="json",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"}
        )

        self.tko_aly_id = response.data["id"]


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
        """A new user can't be created if the username is too long"""

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
        """A new user can't be created if the password is too weak"""

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
        """LeppisPJ and Leppisvarapj can delete a user"""

        # create an user
        created_user = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "christina",
                "role": 5,
            },
            format="json",
        )

        user_id = created_user.data['id']
        response = self.client.delete(
            f"http://localhost:8000/api/users/delete_user/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_delete_user_as_tavallinen(self):
        """Deleting a user fails if the user does not have a permission for it"""

        # create an user
        created_user = self.client.post(
            "http://localhost:8000/api/users/register",
            data={
                "username": "christina",
                "password": "vahvaSalasana1234",
                "email": "regina.gaudium@gmail.com",
                "telegram": "christina",
                "role": 5,
            },
            format="json",
        )

        # try to delete user as a Tavallinen
        user_id = created_user.data['id']
        response = self.client.delete(
            f"http://localhost:8000/api/users/delete_user/{user_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_delete_user_notfound(self):
        """Attempting to delete a non-existent user results in a 404"""

        response = self.client.delete(
            f"http://localhost:8000/api/users/delete_user/10/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
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

        # generate new web tokens
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

        # the telegram name can be removed
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

#    ERROR WITH NEW DATABASE STRUCTURE
#    def test_updating_as_muokkaus_tavallinen(self):
#        """
#        Muokkausoikeudellinen (role 3) users can update avaimellinen and tavallinen (role 4 and 5) 
#        users if they belong to same organization
#        """
#
#        # Create a new organization
#        self.client.post(
#            "http://localhost:8000/api/organizations/create",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "name": "Matrix",
#                "email": "matrix_ry@gmail.com",
#                "homepage": "matrix-ry.fi",
#                "size": 1,
#            },
#            format="json",
#        )
#
#        # Add a tavallinen (role 5) user to the organization
#        self.client.put(
#            f"http://localhost:8000/api/organizations/add_user_organization/{self.tavallinen_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"organization_name": "Matrix"},
#            format="json",
#        )
#
#        # Add a muokkausoikeudellinen (role 3) user to the organization
#        self.client.put(
#            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"organization_name": "Matrix"},
#            format="json",
#        )
#
#        # Update the tavallinen user with the muokkausoikeudellinen user
#        response = self.client.put(
#            f"http://localhost:8000/api/users/update/{self.muokkaus_id}/",
#            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
#            data={"telegram": "newtg"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#        self.assertEqual(response.data["telegram"], "newtg")

#    ERROR WITH NEW DATABASE STRUCTURE
#    def test_updating_as_muokkaus_avaimellinen(self):
#        """Same as the previous test but this time we update an avaimellinen (role 4) user"""
#
#        # First add the users to same organization
#        self.client.post(
#            "http://localhost:8000/api/organizations/create",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "name": "Matrix",
#                "email": "matrix_ry@gmail.com",
#                "homepage": "matrix-ry.fi",
#                "size": 1,
#            },
#            format="json",
#        )
#
#        self.client.put(
#            f"http://localhost:8000/api/organizations/add_user_organization/{self.avaimellinen_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"organization_name": "Matrix"},
#            format="json",
#        )
#        self.client.put(
#            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"organization_name": "Matrix"},
#            format="json",
#        )
#
#        user_id = User.objects.all()[3].id
#        response = self.client.put(
#            f"http://localhost:8000/api/users/update/{user_id}/",
#            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
#            data={"telegram": "newtg"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#        self.assertEqual(response.data["telegram"], "newtg")

#    ERROR WITH NEW DATABASE STRUCTURE
#    def test_updating_different_organization_as_muokkaus(self):
#        """
#        Muokkausoikeudellinen (role 3) users can not update a user if they do not
#        have a membership to the same organization
#        """
#
#        # First add the users to different organizations
#        self.client.post(
#            "http://localhost:8000/api/organizations/create",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "name": "Matrix",
#                "email": "matrix_ry@gmail.com",
#                "homepage": "matrix-ry.fi",
#                "size": 1,
#            },
#            format="json",
#        )
#
#        self.client.post(
#            "http://localhost:8000/api/organizations/create",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "name": "TKO-äly",
#                "email": "tkoaly@gmail.com",
#                "homepage": "tkoaly.fi",
#                "size": 1,
#            },
#            format="json",
#        )
#
#        self.client.post(
#            f"http://localhost:8000/api/organizations/add_user_organization/{self.tavallinen_id}",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"organization_name": "Matrix"},
#            format="json",
#        )
#        self.client.post(
#            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"organization_name": "TKO-äly"},
#            format="json",
#        )
#
#        # Attempt updating a user that is now a member of a different organization
#        user_id = User.objects.all()[0].id
#        response = self.client.put(
#            f"http://localhost:8000/api/users/update/{user_id}/",
#            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
#            data={"telegram": "newtg"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_updating_notfound_muokkaus(self):
        """Attempt updating a non-existent user with a muokkausoikeudellinen (role 3) user"""

        response = self.client.put(
            f"http://localhost:8000/api/users/update/10/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_updating_notfound_leppispj(self):
        """Attempt updating a non-existent user with LeppisPJ (role 1)"""

        # try to update user that doesn't exist
        response = self.client.put(
            f"http://localhost:8000/api/users/update/10/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

#    ERROR WITH NEW DATABASE STRUCTURE
#    def test_updating_invalid_tg_as_muokkaus(self):
#        """
#        When a muokkausoikeudellinen (role 3) user attempts updating someone else's
#        telegram name but it is already taken
#        """
#
#        user_id = User.objects.all()[3].id
#        response = self.client.put(
#            f"http://localhost:8000/api/users/update/{user_id}/",
#            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
#            data={"telegram": "klussentg"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#        self.assertEqual(self.avaimellinen["telegram"], "avaimellinen")
    
    def test_updating_invalid_tg_as_leppispj(self):
        """Same as the previous one but with LeppisPJ (role 1)"""

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
        """A few scenarios where LeppisPJ (role 1) attempts creating a new organization"""

        # create an organization as LeppisPJ with an invalid email address
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

        # with a valid email address
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

        # creating an organization fails if the user is not LeppisPJ (role 1)
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
        """Users with role 4 (avaimellinen) or higher can create new events"""


        # Create an event as LeppisPJ with empty description
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
                "description": "",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Creating an event is successful with valid parameters
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Creating an event fails if the user is not LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
                "room": "Kattilahuone",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_room(self):
        """An authorized user can update the room of the event"""

        # first create an event to update it
        event_created = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
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

    # FIX THIS TEST WHEN RESERVATION RIGHTS ARE FIXED (copy data from above test)
    def test_create_event_no_rights(self):
        """An unauthorized user can not create an event"""

        # change the reservation rights to false
        user = User.objects.get(id=self.leppis_id)
        user.rights_for_reservation = False
        user.save()

        # try to create an event
        event_created = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kerhotila",
                "title": "varaus",
                "organizer": "Matrix",
                "description": "",
                "responsible": "Matti",
                "open": True,
            },
            format="json",
        )

        self.assertEqual(event_created.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_room_invalid(self):
        """Updating an event fails with invalid parameters"""

        # first create an event to update it
        event_created = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kerhotila",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        # Attempt setting the room parameter to blank
        event_id = event_created.data['id']
        response = self.client.put(
            f"http://localhost:8000/api/events/update_event/{event_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"room": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(event_created.data["room"], "Kerhotila")

    def test_update_with_nonexistentevent(self):
        """Attempt updating a non-existent event"""

        response = self.client.put(
            "http://localhost:8000/api/events/update_event/1/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"room": "Kattohuoneisto"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_room_role5(self):
        """An unauthorized user can not update events"""

        # first create an event to update it
        event_created = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
                "open": True,
            },
            format="json",
        )

        # Attempt updating the room with a tavallinen (role 5) user
        response = self.client.put(
            "http://localhost:8000/api/events/update_event/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"room": "Kattohuoneisto"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(event_created.data["room"], "Kattilahuone")

#    def test_update_room_no_rights(self):
#        """If a user has their event permissions set to False, they can not update events"""
#
#        # first create an event to update it
#        event_created = self.client.post(
#            "http://localhost:8000/api/events/create_event",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "room": "Kerhotila",
#                "title": "varaus",
#                "organizer": "Matrix",
#                "description": "Pidetään hauskaa",
#                "responsible": "Matti",
#                "open": True,
#            },
#            format="json",
#        )
#
#        # change the reservation rights to false
#        user = User.objects.get(id=self.leppis_id)
#        user.rights_for_reservation = False
#        user.save()
#
#        # try to update an event
#        event_id = event_created.data['id']
#        response = self.client.put(
#            f"http://localhost:8000/api/events/update_event/{event_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"room": "Pelihuone"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#
#    def test_delete_event_no_rights(self):
#        """Attempting to delete an event. Same conditions as in the previous test"""
#
#        # first create an event to delete it
#        event_created = self.client.post(
#            "http://localhost:8000/api/events/create_event",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "room": "Kerhotila",
#                "title": "varaus",
#                "organizer": "Matrix",
#                "description": "Pidetään hauskaa",
#                "responsible": "Matti",
#                "open": True,
#            },
#            format="json",
#        )
#
#        # change the reservation rights to false
#        user = User.objects.get(id=self.leppis_id)
#        user.rights_for_reservation = False
#        user.save()
#
#        # try to delete an event
#        event_id = event_created.data['id']
#        response = self.client.delete(
#            f"http://localhost:8000/api/events/delete_event/{event_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_deleting_event(self):
        """LeppisPJ can delete an event"""

        # create an event as LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/events/create_event",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "room": "Kattilahuone",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
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
                "room": "Kattilahuone",
                "start": datetime.now(),
                "end": datetime.now(),
                "organizer": self.tko_aly_id,
                "title": "Varaus suunnitteluun",
                "description": "Suunnitellaan juhlia",
                "responsible": "Pete",
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
                "user": self.leppis_id,
                "responsible_for": "",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # creating an ykv fails if the user is not LeppisPJ
        response = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
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
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
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
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
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

#    def test_ykv_late_logout(self):
#        """An authorized user can logout ykv"""
#
#        current_time = datetime.now()
#        logout_time = current_time.replace(hour=7, minute=30)
#        login_time = logout_time - timedelta(days=1)
#        login_time = login_time.replace(hour=19, minute=15)
#
#        # first create an ykv
#        ykv_created = self.client.post(
#            "http://localhost:8000/api/ykv/create_responsibility",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "username": "matti",
#                "created_by": "LeppisPJ",
#                "email": "matti@hotmail.com",
#                "responsible_for": "kutsutut vieraat",
#                "login_time": login_time.strftime("%Y-%m-%d %H:%M")
#            },
#            format="json",
#        )
#
#        # late logout
#        ykv_id = ykv_created.data['id']
#        response = self.client.put(
#            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"logout_time": logout_time.strftime("%Y-%m-%d %H:%M")},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#        self.assertEqual(response.data["late"], True)
    
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

        current_time = datetime.now(timezone.utc)
        logout_time = current_time.replace(hour=7, minute=30)

        # first create ykv
        ykv_created = self.client.post(
            "http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
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
        self.assertEqual(ykv_created.data["logout_time"][:19], current_time.strftime("%Y-%m-%dT%H:%M:%S"))
    
    def test_logout_ykv_empty(self):
        """An authorized user can logout ykv"""

        # first create an ykv
        ykv_created = self.client.post(
            f"http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
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

#    POSSIBLY DEPRECATED TEST IF LOGOUT TIMES ARE SET BLANK    
#    def test_logout_ykv_invalid(self):
#        """An authorized user can logout ykv"""
#
#        # first create an ykv
#        ykv_created = self.client.post(
#            f"http://localhost:8000/api/ykv/create_responsibility",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "user": self.leppis_id,
#                "responsible_for": "kutsutut vieraat",
#                "login_time": "1970-01-01T12:00",
#                "logout_time": "1970-01-02T14:00",
#                "present": True,
#                "late": False,
#                "organizations": [self.tko_aly_id, ],
#            },
#            format="json",
#        )
#
#        # try logout_time with empty
#        ykv_id = ykv_created.data['id']
#        response = self.client.put(
#            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"responsible_for": "vip vieraat"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#        self.assertEqual(ykv_created.data["responsible_for"], "kutsutut vieraat")
#
#        current_time = datetime.now()
#        logout_time = current_time.replace(hour=7, minute=0)
#
#        # attempt changing the email address to an invalid one
#        ykv_id = ykv_created.data['id']
#        response = self.client.put(
#            f"http://localhost:8000/api/ykv/logout_responsibility/{ykv_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "email": "badaddress@",
#                "logout_time": logout_time.strftime("%Y-%m-%d %H:%M")
#            },
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
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
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
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

#    ERROR WITH NEW DATABASE STRUCTURE
#    def test_updating_organization_role3(self):
#        """An authorized user can update organization"""
#
#        # first create an organization to update it
#        organization_created = self.client.post(
#            "http://localhost:8000/api/organizations/create",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "name": "Matrix",
#                "email": "matrix_ry@gmail.com",
#                "homepage": "matrix-ry.fi",
#                "size": 1,
#            },
#            format="json",
#        )
#
#        # add user to created organization
#        user = User.objects.get(email="muokkaus@gmail.com")
#        
#        self.client.put(
#            f"http://localhost:8000/api/organizations/add_user_organization/{user.id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "organization_name": "Matrix"
#            },
#            format="json",
#        )
#
#        # update the homepage with role3 user
#        org_id = organization_created.data['id']
#        response = self.client.put(
#            f"http://localhost:8000/api/organizations/update_organization/{org_id}/",
#            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
#            data={"homepage": "matrix.fi"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#        self.assertEqual(response.data["homepage"], "matrix.fi")

#    ERROR WITH NEW DATABASE STRUCTURE
#    def test_updating_organization_role3_invalid(self):
#        """An authorized user can update organization"""
#
#        # first create an organization to update it
#        organization_created = self.client.post(
#            "http://localhost:8000/api/organizations/create",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "name": "Matrix",
#                "email": "matrix_ry@gmail.com",
#                "homepage": "matrix-ry.fi",
#                "size": 1,
#            },
#            format="json",
#        )
#
#        # try update the homepage of organization that user isn't member of
#        org_id = organization_created.data['id']
#        response = self.client.put(
#            f"http://localhost:8000/api/organizations/update_organization/{org_id}/",
#            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
#            data={"homepage": "matrix.fi"},
#            format="json",
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#        self.assertEqual(organization_created.data["homepage"], "matrix-ry.fi")
#    
#    def test_add_user_organization(self):
#        """An authorized user can add member to organization"""
#
#        # first create an organization to add member to it
#        self.client.post(
#            "http://localhost:8000/api/organizations/create",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={
#                "name": "Matrix",
#                "email": "matrix_ry@gmail.com",
#                "homepage": "matrix-ry.fi",
#                "size": 1,
#            },
#            format="json",
#        )
#
#        # add user to created organization
#        response = self.client.put(
#            f"http://localhost:8000/api/organizations/add_user_organization/{self.muokkaus_id}/",
#            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
#            data={"organization_name": "Matrix"},
#            format="json"
#        )
#
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#        muokkaus_user = User.objects.get(id=self.muokkaus_user['id'])
#        self.assertTrue(muokkaus_user.organization['Matrix'])
    
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
    
    def test_hand_over_key_valid(self):
        """A user with permission can hand over a Klusteri key"""
        
        # Hand over a key to a regular user with LeppisPJ
        user_id = User.objects.all()[0].id
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{user_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={"organization_name": "tko-aly"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["keys"][0]["id"], self.tko_aly_id)
    
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

        # Attempt including additional data to the request
        response = self.client.put(
            f"http://localhost:8000/api/keys/hand_over_key/{self.leppis_id}/",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "organization_name": "Matrix",
                "email": "newemail@gmail.com"
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "You can only hand over a Klusteri key through this endpoint")
    
    def test_creating_defect(self):
        """Roles other than role 5 can create defects"""

        # create a defect as Muokkaus with empty description
        response = self.client.post(
            "http://localhost:8000/api/defects/create_defect",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "description": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # with correct description
        response = self.client.post(
            "http://localhost:8000/api/defects/create_defect",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "description": "Lattia rikki",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_updating_defect(self):
        """Roles other than role 5 can create defects"""

        # create a defect to edit it
        created_defect = self.client.post(
            "http://localhost:8000/api/defects/create_defect",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={
                "description": "Lattia rikki",
            },
            format="json",
        )
        defect_id = created_defect.data["id"]

        # try to update as Tavallinen user
        response = self.client.put(
            f"http://localhost:8000/api/defects/update_defect/{defect_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
                "description": "Katto vuotaa",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # try to update defect that doesn't exist
        response = self.client.put(
            "http://localhost:8000/api/defects/update_defect/10/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={
                "description": "Katto vuotaa",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # update defect with correct information
        response = self.client.put(
            f"http://localhost:8000/api/defects/update_defect/{defect_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={
                "description": "Katto vuotaa",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_deleting_defect(self):
        """Defects can be deleted by roles higher than 5"""

        # create a defect
        created_defect = self.client.post(
            "http://localhost:8000/api/defects/create_defect",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={
                "description": "Lattia rikki",
            },
            format="json",
        )
        defect_id = created_defect.data["id"]

        # delete the defect
        response = self.client.delete(
            f"http://localhost:8000/api/defects/delete_defect/{defect_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # deleting defect fails if the user is Tavallinen
        response = self.client.delete(
            f"http://localhost:8000/api/defects/delete_defect/{defect_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
        # try delete defect that doesn't exist
        response = self.client.delete(
            f"http://localhost:8000/api/defects/delete_defect/10/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_force_logout_ykv_no_ykv(self):
        """Tests force logout ykv when there are no YKVs"""

        result = force_logout_ykv_logins()

        self.assertEqual(result, "Nothing to log out")

    def test_force_logout_ykv(self):
        """Tests force logout ykv"""

        ykv_created = self.client.post(
            f"http://localhost:8000/api/ykv/create_responsibility",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "user": self.leppis_id,
                "responsible_for": "kutsutut vieraat",
                "login_time": "1970-01-01T12:00",
                "logout_time": "1970-01-02T14:00",
                "present": True,
                "late": False,
                "organizations": [self.tko_aly_id, ],
            },
            format="json",
        )

        result = force_logout_ykv_logins()

        self.assertEqual(result, "logged out users")

    def test_creating_cleaning(self):
        """Role 1 can create cleanings"""
        # create another organization first
        self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix Ry",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 0,
            },
            format="json",
        )

        big_organization_id = Organization.objects.get(name="tko-aly").id
        small_organization_id = Organization.objects.get(name="Matrix Ry").id

        # Create 53 cleaning data entries
        for _ in range(53):
            response = self.client.post(
                "http://localhost:8000/api/cleaning/create_cleaning",
                headers={"Authorization": f"Bearer {self.leppis_access_token}"},
                data={
                    "week": 1,
                    "big": big_organization_id,
                    "small": small_organization_id,
                },
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Attempt to create the 54th cleaning data entry
        response = self.client.post(
            "http://localhost:8000/api/cleaning/create_cleaning",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "week": 1,
                "big": big_organization_id,
                "small": small_organization_id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # create cleaning data with incorrect information
        response = self.client.post(
            "http://localhost:8000/api/cleaning/create_cleaning",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "week":1,
                "big": big_organization_id,
                "small": 100,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # create cleaning data with role other than 1
        response = self.client.post(
            "http://localhost:8000/api/cleaning/create_cleaning",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
                "week":1,
                "big": big_organization_id,
                "small": small_organization_id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_removing_cleaning(self):
        """Role 1 can remove cleanings"""
        # create cleaning information first
        self.client.post(
            "http://localhost:8000/api/organizations/create",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "name": "Matrix Ry",
                "email": "matrix_ry@gmail.com",
                "homepage": "matrix-ry.fi",
                "size": 0,
            },
            format="json",
        )

        big_organization_id = Organization.objects.get(name="tko-aly").id
        small_organization_id = Organization.objects.get(name="Matrix Ry").id

        response = self.client.post(
            "http://localhost:8000/api/cleaning/create_cleaning",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "week":1,
                "big": big_organization_id,
                "small": small_organization_id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # remove cleaning data with other role than 1
        response = self.client.delete(
            "http://localhost:8000/api/cleaning/remove/all",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # remove cleaning data with correct information
        response = self.client.delete(
            "http://localhost:8000/api/cleaning/remove/all",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_creating_cleaning_supplies(self):
        """Roles other than role 5 can create cleaning tools"""

        # create a tool with empty details
        response = self.client.post(
            "http://localhost:8000/api/cleaningsupplies/create_tool",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "tool": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # create a tool with correct tool description
        response = self.client.post(
            "http://localhost:8000/api/cleaningsupplies/create_tool",
            headers={"Authorization": f"Bearer {self.leppis_access_token}"},
            data={
                "tool": "pesuaine",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # trying to create a cleaning tool as Tavallinen user fails
        response = self.client.post(
            f"http://localhost:8000/api/cleaningsupplies/create_tool",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={
                "tool": "lattiaharja",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_deleting_cleaning_supplies(self):
        """Cleaning tools can be deleted by roles higher than 5"""

        # create a tool
        created_tool = self.client.post(
            "http://localhost:8000/api/cleaningsupplies/create_tool",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
            data={
                "tool": "imuri",
            },
            format="json",
        )
        tool_id = created_tool.data["id"]

        # delete the tools
        response = self.client.delete(
            f"http://localhost:8000/api/cleaningsupplies/delete_tool/{tool_id}/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # try delete a tool that doesn't exist
        response = self.client.delete(
            f"http://localhost:8000/api/cleaningsupplies/delete_tool/10000/",
            headers={"Authorization": f"Bearer {self.muokkaus_access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # try delete a tool as Tavallinen user fails (role has to be higher than 5)
        response = self.client.delete(
            f"http://localhost:8000/api/cleaningsupplies/delete_tool/{tool_id}/",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

