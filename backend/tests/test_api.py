from django.test import TestCase
from rest_framework.serializers import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from ilotalo.models import User

"""
These tests are related to the API between frontend and backend
"""


class TestDjangoAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
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
            "http://localhost:8000/api/users/userlist",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        self.user = response.data

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
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.all()[1].username, "christina")

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
        self.assertEqual(User.objects.count(), 3)

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
        self.assertEqual(User.objects.count(), 1)

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
        self.assertEqual(User.objects.count(), 1)

    def test_delete_user(self):
        """A user can be deleted"""

        response = self.client.post(
            "http://localhost:8000/users/",
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
        self.assertEqual(User.objects.count(), 2)

        response = self.client.delete("http://localhost:8000/users/2/", format="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)

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
        self.assertEqual(User.objects.count(), 1)

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
            "http://localhost:8000/api/users/userlist",
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
        response = self.client.put(
            "http://localhost:8000/api/users/update/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"email": "uusisp@gmail.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "uusisp@gmail.com")

    def test_updating_email_with_invalid_parameters(self):
        """Updating an email fails without authorization or if the new address is invalid"""

        # attempt updating without authorization
        response = self.client.put(
            "http://localhost:8000/api/users/update/1/",
            data={"email": "uusisp@gmail.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.user["email"], "klusse.osoite@gmail.com")

        # new email address is invalid
        response = self.client.put(
            "http://localhost:8000/api/users/update/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"email": "uusisp"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.user["email"], "klusse.osoite@gmail.com")

        # no email address given
        response = self.client.put(
            "http://localhost:8000/api/users/update/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"email": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.user["email"], "klusse.osoite@gmail.com")

    def test_updating_email_with_taken_address(self):
        """Updating an email address fails if the address is taken"""

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
            "http://localhost:8000/api/users/update/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"email": "regina.gaudium@gmail.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertRaises(ValidationError)
        self.assertEqual(self.user["email"], "klusse.osoite@gmail.com")

    def test_updating_telegram_with_invalid_parameters(self):
        """Updating a telegram name fails without authorization or if the new name is taken"""

        # attempt updating without authorization
        response = self.client.put(
            "http://localhost:8000/api/users/update/1/",
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
            "http://localhost:8000/api/users/update/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": "tguser"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.user["telegram"], "klussentg")
    
    def test_updating_telegram_name(self):
        """An authorized user can update their telegram name"""

        # update the telegram name
        response = self.client.put(
            "http://localhost:8000/api/users/update/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": "newtg"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telegram"], "newtg")

        # telegram can be removed
        response = self.client.put(
            "http://localhost:8000/api/users/update/1/",
            headers={"Authorization": f"Bearer {self.access_token}"},
            data={"telegram": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telegram"], "")

