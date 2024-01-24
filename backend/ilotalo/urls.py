from django.urls import path
# from ilotalo import views
from .views import IndexView

urlpatterns = [
    path('', IndexView.as_view({'get': 'list'}))
]