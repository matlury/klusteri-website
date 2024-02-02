from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from ilotalo.models import User


class TestDjangoAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.data = {
            "username": "klusse",
            "password": 1234,
            "email": "klusse@gmail.com",
            "telegram": "klussentg",
            "role": 5,
        }

        self.client.post(
            "http://localhost:8000/users/",
            data=self.data,
            format="json",
        )

    def test_creating_user(self):
        """A new user can be posted to /users/ if the parameters are valid"""

        response = self.client.post(
            "http://localhost:8000/users/",
            data={
                "username": "christina",
                "password": 1234,
                "email": "regina@gmail.com",
                "telegram": "domustg",
                "role": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.all()[1].username, "christina")

    def test_creating_user_username_too_long(self):
        """A new user can't be posted to /users/ if the username is too long"""

        response = self.client.post(
            "http://localhost:8000/users/",
            data={
                "username": "christinareginadomusgaudium",
                "password": 1234,
                "email": "regina@gmail.com",
                "telegram": "domustg",
                "role": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_creating_user_password_too_long(self):
        """A new user can't be posted to /users/ if the password is too long"""

        response = self.client.post(
            "http://localhost:8000/users/",
            data={
                "username": "christina",
                "password": 123456789123456789123456789,
                "email": "regina@gmail.com",
                "telegram": "domustg",
                "role": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_modify_user(self):
        """A user's information can be changed"""
        self.data["username"] = "klusteri"

        response = self.client.patch(
            "http://localhost:8000/users/1/", data=self.data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user(self):
        """A user can be deleted"""

        response = self.client.post(
            "http://localhost:8000/users/",
            data={
                "username": "christina",
                "password": 1234,
                "email": "regina@gmail.com",
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
