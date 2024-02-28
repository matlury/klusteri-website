from django.urls import path
from .views import (
    RegisterView,
    RetrieveUserView,
    UpdateUserView,
    CreateOrganizationView,
    RemoveOrganizationView,
)

"""Define URL endpoints for the ilotalo app"""

urlpatterns = [
    path("register", RegisterView.as_view()),
    path("userinfo", RetrieveUserView.as_view()),
    path("update/<int:pk>/", UpdateUserView.as_view()),
    path("create", CreateOrganizationView.as_view()),
    path("remove/<int:pk>/", RemoveOrganizationView.as_view())
]
