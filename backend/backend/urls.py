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
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from ilotalo import views

router = routers.DefaultRouter()
router.register(r"users", views.UserView, "ilotalo")
router.register(r"organizations", views.OrganizationView, "organisaatiot")
router.register(r"events", views.EventView, "events")
router.register(r"nightresponsibilities", views.NightResponsibilityView, "nightresponsibilities")
router.register(r"defects", views.DefectFaultView, "defects")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/listobjects/", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/token/blacklist/", TokenBlacklistView.as_view()),
    path("api/users/", include("ilotalo.urls")),
    path("api/organizations/", include("ilotalo.urls")),
    path("api/events/", include("ilotalo.urls")),
    path("api/ykv/", include("ilotalo.urls")),
    path("api/keys/", include("ilotalo.urls")),
    path("api/testing/", include("ilotalo.urls")),
    path("api/defects/", include("ilotalo.urls")),
    path("api/cleaning/", include("ilotalo.urls")),
]
