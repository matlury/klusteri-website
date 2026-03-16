import sys
import os
from django.apps import AppConfig
from django.db import connection
from django.db.models.signals import post_migrate
from django.db.utils import OperationalError
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)


def create_default_user(sender, **kwargs):
    User = get_user_model()
    try:
        default_username = os.getenv("DJANGO_DEFAULT_ADMIN_USERNAME")
        default_email = os.getenv("DJANGO_DEFAULT_ADMIN_EMAIL")
        default_password = os.getenv("DJANGO_DEFAULT_ADMIN_PASSWORD")

        if not User.objects.exists():
            if not User.objects.filter(username=default_username).exists():
                if not default_username or not default_email or not default_password:
                    logger.warning(
                        "Default admin user not created; missing env credentials.")
                    return

                user = User.objects.create_user(
                    default_username,
                    default_password,
                    default_email,
                    "",
                    1
                )
                user.first_login = True
                user.save()
                logger.info(
                    "Default admin user created via environment variables")
    except OperationalError:
        pass


def start_scheduler(sender, **kwargs):
    """Start the scheduler after migrations are complete"""
    try:
        from scheduler import scheduler
        if not scheduler.is_running():
            scheduler.start()
    except Exception as e:
        logger.error(f"Failed to start scheduler: {e}", exc_info=True)


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
            # Create default user after migrations
            post_migrate.connect(create_default_user, sender=self)

            # Start scheduler with lock file to ensure only one instance across workers
            import threading
            import tempfile

            lock_file = os.path.join(
                tempfile.gettempdir(), 'ilotalo_scheduler.lock')

            def start_scheduler_delayed():
                import time
                time.sleep(2)  # Wait for Django to fully initialize

                # Try to create lock file atomically
                try:
                    # Create file exclusively - fails if exists
                    fd = os.open(lock_file, os.O_CREAT |
                                 os.O_EXCL | os.O_WRONLY, 0o644)
                    os.write(fd, str(os.getpid()).encode())
                    os.close(fd)

                    # We got the lock - start scheduler
                    try:
                        from scheduler import scheduler
                        if not scheduler.is_running():
                            scheduler.start()
                            logger.info(
                                f"[Django Ready] Scheduler started (PID {os.getpid()})")
                    except Exception as e:
                        logger.error(
                            f"Failed to start scheduler: {e}", exc_info=True)
                        # Release lock on error
                        try:
                            os.remove(lock_file)
                        except:
                            pass
                except FileExistsError:
                    logger.info(
                        f"[Django Ready] Scheduler already running in another process (PID {os.getpid()})")

            threading.Thread(target=start_scheduler_delayed,
                             daemon=True).start()
