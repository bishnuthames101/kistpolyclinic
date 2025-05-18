from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import os
import logging
from core.models import MedicalRecord

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Deletes medical records that are older than 21 days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulate the deletion without actually removing records',
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        # Calculate the cutoff date (21 days ago)
        cutoff_date = timezone.now() - timedelta(days=21)
        
        # Get all records older than the cutoff date
        old_records = MedicalRecord.objects.filter(uploaded_at__lt=cutoff_date)
        
        if not old_records.exists():
            self.stdout.write(self.style.SUCCESS('No old medical records to delete.'))
            return
        
        count = old_records.count()
        self.stdout.write(f'Found {count} medical records older than 21 days.')
        
        # Delete each record (this will also delete the associated files due to our delete method)
        deleted_count = 0
        for record in old_records:
            try:
                file_path = record.file.path if record.file else None
                record_id = record.id
                patient_name = record.patient.name
                title = record.title
                
                if dry_run:
                    self.stdout.write(f'Would delete record {record_id}: {patient_name} - {title} (DRY RUN)')
                    deleted_count += 1
                else:
                    # Delete the record (this will call our custom delete method that removes the file)
                    record.delete()
                    deleted_count += 1
                    self.stdout.write(f'Deleted record {record_id}: {patient_name} - {title}')
                    if file_path and os.path.exists(file_path):
                        self.stdout.write(self.style.ERROR(f'Warning: File still exists at {file_path}'))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error deleting record {record.id}: {str(e)}'))
                logger.error(f'Error deleting medical record {record.id}: {str(e)}')
        
        if dry_run:
            self.stdout.write(self.style.SUCCESS(f'Dry run completed. Would have deleted {deleted_count} old medical records.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_count} old medical records.'))
