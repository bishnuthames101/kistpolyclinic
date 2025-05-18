from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    login_user, register_user, UserViewSet, AppointmentViewSet, 
    LaboratoryTestViewSet, PharmacyOrderViewSet, MedicalRecordViewSet,
    MedicineViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import views as auth_views

# Create a router for ViewSet-based APIs
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'laboratory-tests', LaboratoryTestViewSet, basename='laboratory-tests')
router.register(r'pharmacy-orders', PharmacyOrderViewSet, basename='pharmacy-orders')
router.register(r'medical-records', MedicalRecordViewSet, basename='medical-records')
router.register(r'users', UserViewSet, basename='users')
router.register(r'medicines', MedicineViewSet, basename='medicines')

urlpatterns = [
    # Authentication endpoints (function-based views since they're specific actions)
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password reset endpoints (using Django's built-in views)
    path('auth/reset-password/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('auth/reset-password/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('auth/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('auth/reset-password/complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    
    # Include all ViewSet-based API routes
    path('', include(router.urls)),
]
