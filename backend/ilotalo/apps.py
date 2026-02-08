import sys
import os
from django.apps import AppConfig
from django.db import connection
from django.db.models.signals import post_migrate
from django.db.utils import OperationalError
from django.contrib.auth import get_user_model


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
        # Prefer an explicit testing detection to avoid running
        # startup side-effects (creating default users, starting scheduler)
        # during test runs. Check settings, common argv flag and env vars.
        try:
            from django.conf import settings
            settings_testing = getattr(settings, "TESTING", False)
        except Exception:
            settings_testing = False

        is_testing = (
            settings_testing
            or 'test' in sys.argv
            or 'pytest' in sys.modules
            or os.environ.get('PYTEST_CURRENT_TEST') is not None
            or os.environ.get('RUNNING_TESTS') == '1'
        )

        if not is_testing:
            # Use post_migrate instead of connection_created to avoid checking on every request
            post_migrate.connect(create_default_user, sender=self)
            
            # Re-enable scheduler start on first request
            # This ensures it doesn't slow down dev server startup or migrations
            from django.core.signals import request_started
            request_started.connect(self._delayed_scheduler_start)

    def _delayed_scheduler_start(self, **kwargs):
        """Start scheduler after first request to avoid async context issues"""
        # Ensure we only run this once by disconnecting the signal immediately
        from django.core.signals import request_started
        request_started.disconnect(self._delayed_scheduler_start)
        
        try:
            if self._check_scheduler_tables():
                from scheduler import scheduler
                if not scheduler.is_running():
                    scheduler.start()
        except OperationalError:
            pass

    def _check_scheduler_tables(self):
        table_names = connection.introspection.table_names()
        return "django_apscheduler_djangojob" in table_names and "django_apscheduler_djangojobexecution" in table_names