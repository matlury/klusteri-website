"""Management command to check scheduler status."""
from django.core.management.base import BaseCommand
from scheduler import scheduler as scheduler_module


class Command(BaseCommand):
    help = 'Check if the scheduler is running and show scheduled jobs'

    def handle(self, *args, **options):
        scheduler = scheduler_module.scheduler

        if scheduler is None:
            self.stdout.write(self.style.ERROR('Scheduler not initialized'))
            return

        if scheduler.running:
            self.stdout.write(self.style.SUCCESS('✓ Scheduler is RUNNING'))

            jobs = scheduler.get_jobs()
            if jobs:
                self.stdout.write(f'\nScheduled jobs ({len(jobs)}):')
                for job in jobs:
                    self.stdout.write(f'  • {job.id}: {job.next_run_time}')
            else:
                self.stdout.write(self.style.WARNING('  No jobs scheduled'))
        else:
            self.stdout.write(self.style.ERROR('✗ Scheduler is NOT running'))
