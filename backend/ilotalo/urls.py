from django.urls import path
from .views import (
    RegisterView,
    RetrieveUserView,
    UpdateUserView,
    CreateOrganizationView,
    RemoveOrganizationView,
    CreateEventView,
    RemoveEventView,
    UpdateEventView,
    UpdateNightResponsibilityView,
    CreateNightResponsibilityView,
    UpdateOrganizationView,
    AddUserOrganizationView,
)

"""Define URL endpoints for the ilotalo app"""

urlpatterns = [
    path("register", RegisterView.as_view()),
    path("userinfo", RetrieveUserView.as_view()),
    path("update/<int:pk>/", UpdateUserView.as_view()),
    path("create", CreateOrganizationView.as_view()),
    path("remove/<int:pk>/", RemoveOrganizationView.as_view()),
    path("create_event", CreateEventView.as_view()),
    path("delete_event/<int:pk>/", RemoveEventView.as_view()),
    path("update_event/<int:pk>/", UpdateEventView.as_view()),
    path("create_responsibility", CreateNightResponsibilityView.as_view()),
    path("update_responsibility/<int:pk>/", UpdateNightResponsibilityView.as_view()),
    path("update_organization/<int:pk>/", UpdateOrganizationView.as_view()),
    path("add_user_organization", AddUserOrganizationView.as_view())
]
