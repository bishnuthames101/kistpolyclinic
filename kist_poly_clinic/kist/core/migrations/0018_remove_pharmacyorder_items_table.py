from django.db import migrations


class Migration(migrations.Migration):
    """
    This migration removes the pharmacyorder_items table to complete the refactoring
    """
    dependencies = [
        ('core', '0017_add_medicine_fields_to_pharmacyorder'),
    ]

    operations = [
        migrations.RunSQL(
            # SQL to execute
            "DROP TABLE IF EXISTS core_pharmacyorder_items CASCADE;",
            # SQL to reverse this operation (empty since we can't easily restore the table)
            ""
        ),
    ]
