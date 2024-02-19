"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/

URL endpoints:
<baseurl>/admin/
    - Django admin page
<baseurl>/
    - Endpoints registered by DefaultRouter
    - users/ displays a list of all User objects
    - organizations/ displays a list of all Organization objects
<baseurl>/api/token/
    - Get new JSON web tokens for a user
<baseurl>/api/token/refresh/
    - Get a new access token for a user
<basurl>/api/users/
    - Endpoints defined in ilotalo/urls.py
    - register/ handles registartion of new users
    - userlist/ displays data of a specific user
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from ilotalo import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r"users", views.UserView, "ilotalo")
router.register(r"organizations", views.OrganizationView, "organisaatiot")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/users/", include("ilotalo.urls")),
]
