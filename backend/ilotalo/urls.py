from django.urls import path
from .views import (
    RegisterView,
    RetrieveUserView,
    UpdateUserView,
    CreateOrganizationView,
    RemoveOrganizationView,
    CreateEventView,
    RemoveEventView,
)

"""Define URL endpoints for the ilotalo app"""

urlpatterns = [
    path("register", RegisterView.as_view()),
    path("userinfo", RetrieveUserView.as_view()),
    path("update/<int:pk>/", UpdateUserView.as_view()),
    path("create", CreateOrganizationView.as_view()),
    path("remove/<int:pk>/", RemoveOrganizationView.as_view()),
    path("create_event", CreateEventView.as_view()),
    path("delete_event/<int:pk>/", RemoveEventView.as_view())
]
