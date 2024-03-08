"""
URL configuration for backend.

URL endpoints:
<baseurl>/admin/
    - Django admin page
<baseurl>/
    - Url endpoints registered by DefaultRouter
    - users/ displays a list of all User objects
    - organizations/ displays a list of all Organization objects
<baseurl>/api/token/
    - Get new JSON web tokens for a user
<baseurl>/api/token/refresh/
    - Get a new access token for a user
<baseurl>/api/users/
    - URL endpoints defined in ilotalo/urls.py
    - register/ handles registartion of new users
    - userlist/ displays data of a specific user
    - newemail/<user.id>/ update an email address
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from ilotalo import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

router = routers.DefaultRouter()
router.register(r"users", views.UserView, "ilotalo")
router.register(r"organizations", views.OrganizationView, "organisaatiot")
router.register(r"events", views.EventView, "events")
router.register(r"nightresponsibilities", views.NightResponsibilityView, "nightresponsibilities")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/listobjects/", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/token/blacklist/", TokenBlacklistView.as_view()),
    path("api/users/", include("ilotalo.urls")),
    path("api/organizations/", include("ilotalo.urls")),
    path("api/events/", include("ilotalo.urls")),
    path("api/ykv/", include("ilotalo.urls"))
]
