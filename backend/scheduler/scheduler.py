from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from apscheduler.triggers.cron import CronTrigger
from django.utils import timezone
from django_apscheduler.models import DjangoJobExecution, DjangoJob
import sys
from ilotalo.views import force_logout_ykv_logins

def force_logout_ykv():
    print(force_logout_ykv_logins())

def delete_old_job_executions():
    DjangoJobExecution.objects.delete_old_job_executions(0)

def clear_existing_jobs():
    DjangoJob.objects.all().delete()

def start():
    clear_existing_jobs()
    delete_old_job_executions()
    scheduler = BackgroundScheduler(timezone="Europe/Kiev")
    scheduler.add_jobstore(DjangoJobStore(), "default")
    scheduler.add_job(
        force_logout_ykv,
        trigger=CronTrigger(hour=8, minute=00),
        id="force_logout_ykv",
        max_instances=1,
        replace_existing=True,
        jobstore='default'
    )
    register_events(scheduler)
    scheduler.start()
    print("Scheduler started...", file=sys.stdout)
