from django.apps import AppConfig
from django.db import connection
from django.db.backends.signals import connection_created
from django.db.utils import OperationalError
from django.dispatch import receiver
from django.contrib.auth import get_user_model
import string

def create_default_user(sender, **kwargs):
    User = get_user_model()
    try:
        if not User.objects.filter(username='leppispj').exists():
            User.objects.create_user('leppispj', 'password', 'pj@leppis.fi', "", 1)
            print("Default admin user created")
        else:
            print("Default admin user already exists")
    except OperationalError:
        pass

class IlotaloConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ilotalo"

    def ready(self):
        self.start_scheduler()
        connection_created.connect(create_default_user)

    def start_scheduler(self):
        try:
            if self._check_scheduler_tables():
                from scheduler import scheduler
                scheduler.start()

        except OperationalError:
            pass

    def _check_scheduler_tables(self):
        table_names = connection.introspection.table_names()
        return "django_apscheduler_djangojob" in table_names and "django_apscheduler_djangojobexecution" in table_names
