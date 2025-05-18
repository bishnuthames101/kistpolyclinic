from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Appointment, LaboratoryTest, PharmacyOrder, MedicalRecord, Medicine
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('id', 'role')


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('phone', 'email', 'password', 'name', 'address', 'role')
        extra_kwargs = {
            'role': {'read_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            phone=validated_data['phone'],
            email=validated_data['email'],
            name=validated_data['name'],
            address=validated_data.get('address', ''),
            password=validated_data['password']
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)


class LaboratoryTestSerializer(serializers.ModelSerializer):
    is_past = serializers.BooleanField(read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    patient_id = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = LaboratoryTest
        fields = [
            'id', 'patient', 'patient_name', 'test_name', 'test_description',
            'test_date', 'test_time', 'status', 'notes',
            'created_at', 'updated_at', 'is_past', 'patient_id'
        ]
        read_only_fields = ['created_at', 'updated_at', 'patient']

    def validate(self, data):
        # Ensure test date is not in the past
        if data['test_date'] < timezone.now().date():
            raise serializers.ValidationError({
                'test_date': 'Test date cannot be in the past.'
            })

        # Ensure test time is valid
        try:
            # Try to parse the time string
            if isinstance(data['test_time'], str):
                from datetime import datetime
                datetime.strptime(data['test_time'], '%H:%M:%S')
        except ValueError as e:
            raise serializers.ValidationError({
                'test_time': f'Invalid time format. Use HH:MM:SS format. Error: {str(e)}'
            })

        # Get the patient object
        try:
            patient = User.objects.get(id=data['patient_id'])
            data['patient'] = patient
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'patient_id': 'Invalid patient ID'
            })

        return data

class AppointmentSerializer(serializers.ModelSerializer):
    is_past = serializers.BooleanField(read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'doctor_name', 'doctor_specialization',
            'appointment_date', 'appointment_time', 'status', 'reason', 'notes',
            'created_at', 'updated_at', 'is_past'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        # Print received data for debugging
        print('Validating appointment data:', data)

        # Ensure all required fields are present
        required_fields = ['doctor_name', 'doctor_specialization', 'appointment_date', 'appointment_time']
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError({
                    field: f'{field} is required.'
                })

        # Ensure appointment date is not in the past
        if data['appointment_date'] < timezone.now().date():
            raise serializers.ValidationError({
                'appointment_date': 'Appointment date cannot be in the past.'
            })

        # Ensure appointment time is valid
        try:
            # Try to parse the time string
            if isinstance(data['appointment_time'], str):
                from datetime import datetime
                datetime.strptime(data['appointment_time'], '%H:%M:%S')
        except ValueError as e:
            raise serializers.ValidationError({
                'appointment_time': f'Invalid time format. Use HH:MM:SS format. Error: {str(e)}'
            })

        return data


class MedicineSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Medicine
        fields = [
            'id', 'name', 'description', 'price', 'image',
            'category', 'stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PharmacyOrderSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = PharmacyOrder
        fields = [
            'id', 'patient', 'patient_name', 
            'medicine_name', 'quantity', 'price_per_unit', 'medicine_image',
            'total_amount', 'order_date', 'status', 'delivery_address',
            'payment_method', 'payment_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'patient', 'order_date', 'total_amount']

    def create(self, validated_data):
        request = self.context.get('request')
        
        # Set the patient to the currently authenticated user
        validated_data['patient'] = request.user
        
        # Calculate total amount
        validated_data['total_amount'] = validated_data['price_per_unit'] * validated_data['quantity']
        
        # Create the order
        order = PharmacyOrder.objects.create(**validated_data)
        return order


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    file_url = serializers.SerializerMethodField()
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'patient', 'patient_name', 'title', 'description',
            'file', 'file_url', 'file_type', 'uploaded_at'
        ]
        read_only_fields = ['uploaded_at', 'file_type', 'patient']
    
    def get_file_url(self, obj):
        if obj.file:
            # Return the direct URL to the file
            return obj.file.url
        return None
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['patient'] = request.user
        
        # Extract file_type from the file extension
        file = validated_data.get('file')
        if file:
            file_name = file.name.lower()
            if file_name.endswith('.pdf'):
                validated_data['file_type'] = 'pdf'
            elif file_name.endswith(('.jpg', '.jpeg')):
                validated_data['file_type'] = 'jpg'
            elif file_name.endswith('.png'):
                validated_data['file_type'] = 'png'
            else:
                validated_data['file_type'] = 'other'
                
        return super().create(validated_data)