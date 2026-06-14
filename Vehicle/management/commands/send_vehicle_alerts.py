from django.core.management.base import BaseCommand
from Vehicle.views import send_expiry_emails


class Command(BaseCommand):
    help = 'Send expiry reminder emails for vehicles'

    def handle(self, *args, **kwargs):
        self.stdout.write('Checking vehicle expiry dates...')
        send_expiry_emails()
        self.stdout.write(self.style.SUCCESS('Done!'))