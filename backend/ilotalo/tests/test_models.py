from django.test import TestCase
from ilotalo.models import User, Organization

# Create your tests here.
class UserTest(TestCase):
    def setUp(self):
        User.objects.create(
            username = "testuser",
            password = 1234,
            email = "test@gmail.com",
            telegram = "testtg",
            role = 5
        )
        user = User.objects.all()[0]
        print(user)

    def test_if_works(self):
        self.assertTrue(True)

    def test_another(self):
        self.assertFalse(False)



"""
class AnimalTestCase(TestCase):
    def setUp(self):
        Animal.objects.create(name="lion", sound="roar")
        Animal.objects.create(name="cat", sound="meow")

    def test_animals_can_speak(self):
        "Animals that can speak are correctly identified"
        lion = Animal.objects.get(name="lion")
        cat = Animal.objects.get(name="cat")
        self.assertEqual(lion.speak(), 'The lion says "roar"')
        self.assertEqual(cat.speak(), 'The cat says "meow"')
"""