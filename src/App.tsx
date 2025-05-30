import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfile from './pages/DoctorProfile';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LabTestsPage from './pages/LabTestsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EPharmacyPage from './pages/EPharmacyPage';
import CategoryPage from './pages/CategoryPage';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AllLabTestsPage from './pages/AllLabTestsPage';
import AllPackagesPage from './pages/AllPackagesPage';
import TestDetailPage from './pages/TestDetailPage';
import PackageDetailPage from './pages/PackageDetailPage';
import ScrollToTop from './components/ScrollToTop';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-white">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/doctors/:id" element={<DoctorProfile />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route path="/lab-tests" element={<LabTestsPage />} />
                <Route path="/lab-tests/all" element={<AllLabTestsPage />} />
                <Route path="/lab-tests/packages" element={<AllPackagesPage />} />
                <Route path="/lab-tests/test/:id" element={<TestDetailPage />} />
                <Route path="/lab-tests/package/:id" element={<PackageDetailPage />} />
                <Route path="/epharmacy" element={<EPharmacyPage />} />
                <Route path="/epharmacy/category/:category" element={<CategoryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}