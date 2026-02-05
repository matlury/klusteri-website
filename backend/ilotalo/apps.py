import sys
from django.apps import AppConfig
from django.db import connection
from django.db.backends.signals import connection_created
from django.db.utils import OperationalError
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from django.core.signals import request_started


def create_default_user(sender, **kwargs):
    User = get_user_model()
    try:
        if not User.objects.exists():
            if not User.objects.filter(username='leppispj').exists():
                user = User.objects.create_user(
                    'leppispj', '', 'pj@leppis.fi', "", 1)
                user.first_login = True
                user.save()
                print("Default admin user created")
    except OperationalError:
        pass


class IlotaloConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ilotalo"

    def ready(self):
        # Defer scheduler start to avoid async context issues
        # DISABLED: Scheduler causes 10-14s delay on first request in production
        # request_started.connect(self._delayed_scheduler_start)
        if 'test' not in sys.argv:
            connection_created.connect(create_default_user)

    def _delayed_scheduler_start(self, **kwargs):
        """Start scheduler after first request to avoid async context issues"""
        try:
            if self._check_scheduler_tables():
                from scheduler import scheduler
                if not scheduler.is_running():
                    scheduler.start()
                    print("Scheduler started...")
        except OperationalError:
            pass

    def _check_scheduler_tables(self):
        table_names = connection.introspection.table_names()
        return "django_apscheduler_djangojob" in table_names and "django_apscheduler_djangojobexecution" in table_names
