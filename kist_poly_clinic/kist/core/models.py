from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.db.models.signals import pre_delete
from django.dispatch import receiver
import os
from django.core.files.storage import FileSystemStorage
from django.conf import settings

local_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'medical_records'))

class UserManager(BaseUserManager):
    def create_user(self, phone, email, name, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Phone field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(phone=phone, email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, phone, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', self.model.ROLE_ADMIN)  # Set role to admin automatically
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
            
        return self.create_user(phone, email, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_PATIENT = 'patient'
    ROLE_ADMIN = 'admin'

    ROLE_CHOICES = [
        (ROLE_PATIENT, 'Patient'),
        (ROLE_ADMIN, 'Admin'),
    ]
    
    objects = UserManager()
    
    username = models.CharField(max_length=150, unique=False, blank=True, null=True)

    
    phone = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True, null=True)  # <-- Add address
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_PATIENT)
    
    is_staff = models.BooleanField(default=False)  # <-- Add is_staff field
    is_active = models.BooleanField(default=True)  # <-- Add is_active field
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['email', 'name']

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = f"user_{self.phone}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Medicine(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='medicine/', blank=True)
    category = models.CharField(max_length=100)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
        verbose_name = 'Medicine'
        verbose_name_plural = 'Medicines'
    
    def __str__(self):
        return f"{self.name} ({self.category})"
    
    def delete(self, *args, **kwargs):
        # Manually handle related PharmacyOrderItem records
        from django.db import connection
        with connection.cursor() as cursor:
            # Set medicine to NULL for related order items
            # Cast the ID to string to match the varchar column type
            cursor.execute(
                "UPDATE core_pharmacyorderitem SET medicine_code = NULL WHERE medicine_code = %s",
                [str(self.id)]
            )
        # Now delete the medicine itself
        super().delete(*args, **kwargs)


class LaboratoryTest(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='laboratory_tests')
    test_name = models.CharField(max_length=255)
    test_description = models.TextField()
    test_date = models.DateField()
    test_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-test_date', '-test_time']

    def __str__(self):
        return f"{self.patient.name}'s {self.test_name} test on {self.test_date}"

    @property
    def is_past(self):
        test_datetime = timezone.make_aware(
            timezone.datetime.combine(self.test_date, self.test_time)
        )
        return test_datetime < timezone.now()

class Appointment(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    doctor_name = models.CharField(max_length=255)
    doctor_specialization = models.CharField(max_length=255)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reason = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-appointment_date', '-appointment_time']

    def __str__(self):
        return f"{self.patient.name}'s appointment with {self.doctor_name} on {self.appointment_date}"

    @property
    def is_past(self):
        appointment_datetime = timezone.make_aware(
            timezone.datetime.combine(self.appointment_date, self.appointment_time)
        )
        return appointment_datetime < timezone.now()


# Removing PharmacyOrderItem model as it's being merged into PharmacyOrder

class PharmacyOrder(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_PROCESSING = 'processing'
    STATUS_DELIVERED = 'delivered'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_DELIVERED, 'Delivered'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]
    
    PAYMENT_STATUS_PENDING = 'pending'
    PAYMENT_STATUS_COMPLETED = 'completed'
    PAYMENT_STATUS_FAILED = 'failed'
    
    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, 'Pending'),
        (PAYMENT_STATUS_COMPLETED, 'Completed'),
        (PAYMENT_STATUS_FAILED, 'Failed'),
    ]
    
    # Patient information
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pharmacy_orders')
    
    # Medicine information (simplified)
    medicine_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    medicine_image = models.URLField(blank=True, null=True)
    
    # Order information
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    delivery_address = models.TextField(blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    payment_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES, 
        default=PAYMENT_STATUS_PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Add a property to get the related Medicine object when needed
    @property
    def medicine(self):
        if self.medicine_code:
            try:
                return Medicine.objects.get(id=self.medicine_code)
            except Medicine.DoesNotExist:
                return None
        return None
        
    def save(self, *args, **kwargs):
        # Calculate total amount before saving if not already set
        if self.price_per_unit and self.quantity and (self.total_amount == 0 or self.total_amount is None):
            self.total_amount = self.price_per_unit * self.quantity
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.patient.name}'s order ({self.id}) - {self.status}"


class MedicalRecord(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_records')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='medical_records/', storage=local_storage)
    file_type = models.CharField(max_length=10)  # pdf, jpg, png, etc.
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.patient.name}'s medical record - {self.title}"
    
    def delete(self, *args, **kwargs):
        # Delete the file from the filesystem
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        # Call the "real" delete() method
        super().delete(*args, **kwargs)





# Signal to delete files when MedicalRecord is deleted through admin or other methods
@receiver(pre_delete, sender=MedicalRecord)
def delete_medical_record_file(sender, instance, **kwargs):
    """
    Delete the file associated with a MedicalRecord when the record is deleted.
    This handles cases where the model's delete() method is bypassed (e.g., bulk deletes).
    """
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)
