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
    LogoutNightResponsibilityView,
    RightsForReservationView,
    ResetDatabaseView,
    HandOverKeyView,
    RemoveUserView,
    CreateDefectFaultView,
    UpdateDefectFaultView,
    RemoveDefectFaultView,
    RepairDefectFaultView,
    EmailDefectFaultView,
    CreateCleaningView,
    RemoveCleaningView,
    CleaningSuppliesView,
    CreateCleaningSuppliesView,
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
    path("add_user_organization/<int:pk>/", AddUserOrganizationView.as_view()),
    path("logout_responsibility/<int:pk>/", LogoutNightResponsibilityView.as_view()),
    path("update_organization/<int:pk>/", UpdateOrganizationView.as_view()),
    path("change_rights_reservation/<int:pk>/", RightsForReservationView.as_view()),
    path("hand_over_key/<int:pk>/", HandOverKeyView.as_view()),
    path("reset", ResetDatabaseView.as_view()),
    path("delete_user/<int:pk>/", RemoveUserView.as_view()),
    path("create_defect", CreateDefectFaultView.as_view()),
    path("repair_defect/<int:pk>/", RepairDefectFaultView.as_view()),
    path("email_defect/<int:pk>/", EmailDefectFaultView.as_view()),
    path("update_defect/<int:pk>/", UpdateDefectFaultView.as_view()),
    path("delete_defect/<int:pk>/", RemoveDefectFaultView.as_view()),
    path("create_cleaning", CreateCleaningView.as_view()),
    path("remove/all", RemoveCleaningView.as_view()),
    path("cleaningsupplies", CleaningSuppliesView.as_view()),
    path("create_tool", CreateCleaningSuppliesView.as_view()),

]
