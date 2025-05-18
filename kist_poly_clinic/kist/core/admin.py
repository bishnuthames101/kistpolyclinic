from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import (
    User, Appointment, LaboratoryTest, 
    PharmacyOrder, MedicalRecord, Medicine
)

class AppointmentInline(admin.TabularInline):
    model = Appointment
    extra = 0
    fields = ('doctor_name', 'doctor_specialization', 'appointment_date', 'appointment_time', 'status')
    readonly_fields = ('created_at',)
    can_delete = False
    show_change_link = True

class LaboratoryTestInline(admin.TabularInline):
    model = LaboratoryTest
    extra = 0
    fields = ('test_name', 'test_date', 'status')
    readonly_fields = ('created_at',)
    can_delete = False
    show_change_link = True

class PharmacyOrderInline(admin.StackedInline):
    model = PharmacyOrder
    fk_name = 'patient'
    extra = 0
    fields = ('order_date', 'status', 'total_amount')
    readonly_fields = ('created_at', 'order_date', 'total_amount')
    can_delete = False
    show_change_link = True

class MedicalRecordInline(admin.TabularInline):
    model = MedicalRecord
    extra = 0
    fields = ('title', 'file_type', 'uploaded_at', 'file')
    readonly_fields = ('uploaded_at', 'file_preview')
    can_delete = False
    show_change_link = True
    
    def file_preview(self, obj):
        if obj.file:
            if obj.file_type in ['jpg', 'jpeg', 'png']:
                return format_html('<a href="{}" target="_blank"><img src="{}" width="100" /></a>', obj.file.url, obj.file.url)
            else:
                return format_html('<a href="{}" target="_blank">View File</a>', obj.file.url)
        return "No file"

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('phone', 'name', 'email', 'is_active', 'is_staff', 'appointment_count', 'labtest_count', 'order_count', 'record_count')
    search_fields = ('phone', 'name', 'email')
    list_filter = ('is_active', 'is_staff', 'role')
    readonly_fields = ('is_superuser',)
    fieldsets = (
        ('Personal Information', {'fields': ('phone', 'name', 'email', 'address', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    inlines = [MedicalRecordInline, AppointmentInline, LaboratoryTestInline, PharmacyOrderInline]
    
    def appointment_count(self, obj):
        count = obj.appointments.count()
        url = reverse('admin:core_appointment_changelist') + f'?patient__id__exact={obj.id}'
        return format_html('<a href="{}">{} appointments</a>', url, count)
    
    def labtest_count(self, obj):
        count = obj.laboratory_tests.count()
        url = reverse('admin:core_laboratorytest_changelist') + f'?patient__id__exact={obj.id}'
        return format_html('<a href="{}">{} lab tests</a>', url, count)
    
    def order_count(self, obj):
        count = obj.pharmacy_orders.count()
        url = reverse('admin:core_pharmacyorder_changelist') + f'?patient__id__exact={obj.id}'
        return format_html('<a href="{}">{} orders</a>', url, count)
    
    def record_count(self, obj):
        count = obj.medical_records.count()
        url = reverse('admin:core_medicalrecord_changelist') + f'?patient__id__exact={obj.id}'
        return format_html('<a href="{}">{} medical records</a>', url, count)
    
    appointment_count.short_description = 'Appointments'
    labtest_count.short_description = 'Lab Tests'
    order_count.short_description = 'Orders'
    record_count.short_description = 'Medical Records'

# OrderItemInline class removed as we've merged PharmacyOrderItem into PharmacyOrder

@admin.register(PharmacyOrder)
class PharmacyOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient_name', 'medicine_name', 'quantity', 'total_amount', 'status', 'order_date', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('patient__name', 'patient__phone', 'delivery_address', 'medicine_name')
    readonly_fields = ('created_at', 'updated_at', 'order_date', 'total_amount')
    fieldsets = (
        ('Patient Information', {'fields': ('patient',)}),
        ('Medicine Details', {'fields': ('medicine_name', 'quantity', 'price_per_unit', 'medicine_image')}),
        ('Order Details', {'fields': ('total_amount', 'order_date', 'status', 'delivery_address')}),
        ('Payment Information', {'fields': ('payment_method', 'payment_status')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    actions = ['mark_as_processing', 'mark_as_delivered', 'mark_as_cancelled']
    
    def patient_name(self, obj):
        url = reverse('admin:core_user_change', args=[obj.patient.id])
        return format_html('<a href="{}">{}</a>', url, obj.patient.name)
    
    patient_name.short_description = 'Patient'
    
    def mark_as_processing(self, request, queryset):
        queryset.update(status='processing')
    mark_as_processing.short_description = "Mark selected orders as processing"
    
    def mark_as_delivered(self, request, queryset):
        queryset.update(status='delivered')
    mark_as_delivered.short_description = "Mark selected orders as delivered"
    
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
    mark_as_cancelled.short_description = "Mark selected orders as cancelled"

# PharmacyOrderItemAdmin removed as we've merged PharmacyOrderItem into PharmacyOrder

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient_name', 'doctor_name', 'doctor_specialization', 'appointment_date', 'appointment_time', 'status', 'created_at')
    list_filter = ('status', 'appointment_date', 'doctor_specialization')
    search_fields = ('patient__name', 'patient__phone', 'doctor_name', 'doctor_specialization')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_as_confirmed', 'mark_as_completed', 'mark_as_cancelled']
    
    def patient_name(self, obj):
        url = reverse('admin:core_user_change', args=[obj.patient.id])
        return format_html('<a href="{}">{}</a>', url, obj.patient.name)
    
    patient_name.short_description = 'Patient'
    
    def mark_as_confirmed(self, request, queryset):
        queryset.update(status='confirmed')
    mark_as_confirmed.short_description = "Mark selected appointments as confirmed"
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_as_completed.short_description = "Mark selected appointments as completed"
    
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
    mark_as_cancelled.short_description = "Mark selected appointments as cancelled"

@admin.register(LaboratoryTest)
class LaboratoryTestAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient_name', 'test_name', 'test_date', 'status', 'created_at')
    list_filter = ('status', 'test_date', 'test_name')
    search_fields = ('patient__name', 'patient__phone', 'test_name')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_as_confirmed', 'mark_as_completed', 'mark_as_cancelled']
    
    def patient_name(self, obj):
        url = reverse('admin:core_user_change', args=[obj.patient.id])
        return format_html('<a href="{}">{}</a>', url, obj.patient.name)
    
    patient_name.short_description = 'Patient'
    
    def mark_as_confirmed(self, request, queryset):
        queryset.update(status='confirmed')
    mark_as_confirmed.short_description = "Mark selected tests as confirmed"
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_as_completed.short_description = "Mark selected tests as completed"
    
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
    mark_as_cancelled.short_description = "Mark selected tests as cancelled"

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'stock', 'updated_at', 'image_tag')
    list_filter = ('category',)
    search_fields = ('name', 'description', 'category')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {'fields': ('id', 'name', 'description')}),
        ('Pricing and Inventory', {'fields': ('price', 'stock')}),
        ('Categorization', {'fields': ('category',)}),
        ('Image', {'fields': ('image',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    
    def delete_model(self, request, obj):
        # Use the custom delete method defined in the model
        obj.delete()
        
    def delete_queryset(self, request, queryset):
        # Delete each object individually to use the custom delete method
        for obj in queryset:
            obj.delete()

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 50px;" />', obj.image.url)
        return "No Image"
    image_tag.short_description = 'Image Preview'

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient_name', 'title', 'file_type', 'uploaded_at')
    list_filter = ('file_type', 'uploaded_at')
    search_fields = ('patient__name', 'patient__phone', 'title', 'description')
    readonly_fields = ('uploaded_at', 'file_preview')
    
    def patient_name(self, obj):
        url = reverse('admin:core_user_change', args=[obj.patient.id])
        return format_html('<a href="{}">{}</a>', url, obj.patient.name)
    
    patient_name.short_description = 'Patient'
    
    def file_preview(self, obj):
        if obj.file:
            if obj.file_type in ['jpg', 'jpeg', 'png']:
                return format_html('<a href="{}" target="_blank"><img src="{}" width="200" /></a>', obj.file.url, obj.file.url)
            else:
                return format_html('<a href="{}" target="_blank">View File</a>', obj.file.url)
        return "No file"
    
    file_preview.short_description = 'File Preview'