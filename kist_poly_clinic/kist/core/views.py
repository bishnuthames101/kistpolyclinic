from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer, 
    AppointmentSerializer, LaboratoryTestSerializer,
    PharmacyOrderSerializer,
    MedicalRecordSerializer, MedicineSerializer
)
from .models import User, Appointment, LaboratoryTest, PharmacyOrder, MedicalRecord, Medicine
from rest_framework.response import Response
from rest_framework.views import APIView
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')

        # Ensure the email is valid and exists in the system
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the password reset token and UID
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Construct the password reset URL
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

        # Send the password reset email
        subject = "Password Reset Request"
        message = render_to_string("registration/password_reset_email.html", {
            "user": user,
            "reset_url": reset_url,
        })
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

        return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not uid or not token or not new_password:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Decode the user ID
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            # Check if the token is valid
            if not default_token_generator.check_token(user, token):
                return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set the new password
            user.set_password(new_password)
            user.save()
            
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid user ID."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            phone=serializer.validated_data['phone'],
            password=serializer.validated_data['password']
        )
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Regular users can only see their own profile
        if not self.request.user.is_staff:
            return User.objects.filter(id=self.request.user.id)
        # Staff users can see all users
        return User.objects.all()
    
    def get_permissions(self):
        # Allow unauthenticated access to create (register)
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class LaboratoryTestViewSet(viewsets.ModelViewSet):
    serializer_class = LaboratoryTestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own tests
        return LaboratoryTest.objects.filter(patient=str(self.request.user.id))

    def perform_create(self, serializer):
        # Get the patient object from the request
        patient = self.request.user
        serializer.save(patient=patient)

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        test = self.get_object()
        test.status = LaboratoryTest.STATUS_CANCELLED
        test.save()
        return Response({'message': 'Test cancelled successfully'})

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['appointment_date', 'appointment_time', 'created_at']
    ordering = ['-appointment_date', '-appointment_time']  # Default ordering

    def get_queryset(self):
        queryset = Appointment.objects.filter(patient=self.request.user)
        print(f"Found {queryset.count()} appointments for user {self.request.user.phone}")
        return queryset

    def perform_create(self, serializer):
        appointment = serializer.save(patient=self.request.user)
        print(f"Created appointment {appointment.id} for user {self.request.user.phone}")
        return appointment

    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)
        print("Request FILES:", request.FILES)
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class PharmacyOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PharmacyOrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'order_date', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        # Regular users can only see their own orders
        if not user.is_staff:
            return PharmacyOrder.objects.filter(patient=user)
        # Staff users can see all orders
        return PharmacyOrder.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        # Only allow cancellation of pending or processing orders
        if order.status not in [PharmacyOrder.STATUS_PENDING, PharmacyOrder.STATUS_PROCESSING]:
            return Response(
                {"error": "Only pending or processing orders can be cancelled"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = PharmacyOrder.STATUS_CANCELLED
        order.save()
        
        return Response(PharmacyOrderSerializer(order).data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {"error": "Status is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if new_status not in dict(PharmacyOrder.STATUS_CHOICES).keys():
            return Response(
                {"error": f"Invalid status. Must be one of {dict(PharmacyOrder.STATUS_CHOICES).keys()}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        order.status = new_status
        order.save()
        
        return Response(PharmacyOrderSerializer(order).data)


class MedicineViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineSerializer
    permission_classes = [AllowAny]  # Allow anyone to view medicines
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['name', 'price', 'category', 'stock']
    ordering = ['category', 'name']
    
    def get_queryset(self):
        queryset = Medicine.objects.all()
        
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)
            
        # Filter by min_price if provided
        min_price = self.request.query_params.get('min_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
            
        # Filter by max_price if provided
        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        # Filter by in_stock if provided
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock and in_stock.lower() == 'true':
            queryset = queryset.filter(stock__gt=0)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all unique medicine categories"""
        categories = Medicine.objects.values_list('category', flat=True).distinct()
        return Response(list(categories))


class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['uploaded_at', 'title']
    ordering = ['-uploaded_at']
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context
    
    def get_queryset(self):
        user = self.request.user
        # Regular users can only see their own medical records
        if not user.is_staff:
            return MedicalRecord.objects.filter(patient=user)
        # Staff users can see all medical records
        return MedicalRecord.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)
    
    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)
        print("Request FILES:", request.FILES)
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['delete'])
    def delete_record(self, request, pk=None):
        record = self.get_object()
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
