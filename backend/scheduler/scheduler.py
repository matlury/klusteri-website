import sys
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler import util

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = None


@util.close_old_connections
def force_logout_ykv_job():
    """
    Job that runs the YKV logout task.
    The decorator ensures database connections are properly managed.
    """
    try:
        logger.info("[YKV Scheduler] Running automatic YKV logout task...")

        from ilotalo.views import force_logout_ykv_logins
        result = force_logout_ykv_logins()

        logger.info(f"[YKV Scheduler] Task completed: {result}")
        return result

    except Exception as e:
        logger.error(
            f"[YKV Scheduler] Error during task execution: {str(e)}", exc_info=True)


def start():
    """Start the APScheduler."""
    global scheduler

    if scheduler is not None and scheduler.running:
        logger.info("[Scheduler] Scheduler already running")
        return

    try:
        from django.conf import settings

        logger.info("[Scheduler] Starting APScheduler...")

        scheduler = BackgroundScheduler(
            timezone='Europe/Helsinki')
        scheduler.add_jobstore(DjangoJobStore(), "default")

        # Add the YKV logout job - runs daily at 8:00 AM Helsinki time
        scheduler.add_job(
            force_logout_ykv_job,
            trigger='cron',
            hour=8,
            minute=0,
            id='force_logout_ykv',
            max_instances=1,
            replace_existing=True,
            jobstore='default',
            misfire_grace_time=300  # Allow 5 minutes delay without warning
        )
        logger.info(
            "[Scheduler] Added job: force_logout_ykv (daily at 8:00 AM Helsinki time)")
        scheduler.start()
        logger.info("[Scheduler] APScheduler started successfully")
    except Exception as e:
        logger.error(
            f"[Scheduler] Failed to start scheduler: {str(e)}", exc_info=True)


def is_running():
    """Check if scheduler is running."""
    global scheduler
    return scheduler is not None and scheduler.running
