from django.apps import AppConfig
from django.db import connection
from django.db.utils import OperationalError

"""Configure apps created in the project root"""

class IlotaloConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ilotalo"

    def ready(self):
        self.start_scheduler()

    def start_scheduler(self):
        try:
            if self._check_scheduler_tables():
                from scheduler import scheduler
                scheduler.start()
        except OperationalError:
            # If the database is not set up yet, skip starting the scheduler
            pass

    def _check_scheduler_tables(self):
        """Check if APScheduler tables exist in the database."""
        table_names = connection.introspection.table_names()
        return "django_apscheduler_djangojob" in table_names and "django_apscheduler_djangojobexecution" in table_names
