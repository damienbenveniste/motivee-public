
from django.core.management.base import BaseCommand
from scheduling.jobs.jobs import get_jobs
import logging

LOGGER = logging.getLogger('watchtower')


class Command(BaseCommand):
    help = "Runs APScheduler."

    def handle(self, *args, **options):

        for job in get_jobs():
            LOGGER.info('Run job {}'.format(job.ID))
            job.run()
