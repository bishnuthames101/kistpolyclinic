from django.db import migrations, models


class Migration(migrations.Migration):
    """
    This migration adds medicine fields directly to PharmacyOrder
    """
    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        # Add medicine fields to PharmacyOrder
        migrations.AddField(
            model_name='pharmacyorder',
            name='medicine_name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pharmacyorder',
            name='quantity',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='pharmacyorder',
            name='price_per_unit',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pharmacyorder',
            name='medicine_image',
            field=models.URLField(blank=True, null=True),
        ),
    ]
