from django.urls import path
from .views import RegisterView, RetrieveUserView

"""Define URL endpoints for the ilotalo app"""

urlpatterns = [
    path("register", RegisterView.as_view()),
    path("userlist", RetrieveUserView.as_view()),
]
