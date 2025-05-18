import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appointments, laboratoryTests } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { format } from 'date-fns';
import {
  User,
  FileText,
  Clock,
  ShoppingBag,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  // Upload removed as it's no longer needed
  FlaskRound as Flask,
  Menu,
  X,
} from 'lucide-react';
import PharmacyOrdersSection from '../components/PharmacyOrdersSection';
import MedicalRecordsSection from '../components/MedicalRecordsSection';
import { Link } from 'react-router-dom';

import type { Appointment, LaboratoryTest } from '../services/api';

function UserProfile() {
  const { user } = useAuth();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone || 'Phone not provided'}</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{user?.address || 'Address not provided'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/services" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center shadow-md transition-colors">
          <Calendar className="w-5 h-5 mr-2" />
          Book Appointment
        </Link>
        <Link to="/lab-tests" className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center shadow-md transition-colors">
          <Flask className="w-5 h-5 mr-2" />
          Book Lab Test
        </Link>
        <Link to="/epharmacy" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center shadow-md transition-colors">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Purchase Pharmacy Items
        </Link>
      </div>
    </div>
  );
}

function AppointmentsSection() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await appointments.getAll();
      const allAppointments = response.data;
      const now = new Date();
      
      // Split appointments into upcoming and past
      const upcoming = allAppointments.filter(apt => new Date(apt.appointment_date) >= now);
      const past = allAppointments.filter(apt => new Date(apt.appointment_date) < now);
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor_name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(new Date(appointment.appointment_date), 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{format(new Date(`2000-01-01T${appointment.appointment_time}`), 'h:mm a')}</span>
        </div>
        {appointment.reason && (
          <div className="flex items-start text-gray-600 mt-2">
            <XCircle className="w-4 h-4 mr-2 mt-1" />
            <span>{appointment.reason}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-600">No upcoming appointments scheduled.</p>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Appointments</h2>
        {pastAppointments.length === 0 ? (
          <p className="text-gray-600">No past appointments found.</p>
        ) : (
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// UploadMedicalRecord component removed as medical records are now uploaded from the Django admin

function LabTestsSection() {
  const { /*showToast */ } = useToast();
  const [upcomingTests, setUpcomingTests] = useState<LaboratoryTest[]>([]);
  const [pastTests, setPastTests] = useState<LaboratoryTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTests = async () => {
    try {
      const response = await laboratoryTests.getAll();
      const allTests = response.data;
      const now = new Date();
      
      // Split tests into upcoming and past
      const upcoming = allTests.filter((test: LaboratoryTest) => new Date(test.test_date) >= now);
      const past = allTests.filter((test: LaboratoryTest) => new Date(test.test_date) < now);
      
      setUpcomingTests(upcoming);
      setPastTests(past);
    } catch (error: any) {
      console.error('Error fetching tests:', error);
      setError('Failed to load tests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="flex items-center text-blue-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center text-yellow-600">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center text-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-600">
            {status}
          </span>
        );
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Laboratory Tests</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Tests</h3>
          {upcomingTests.length === 0 ? (
            <p className="text-gray-500">No upcoming tests scheduled</p>
          ) : (
            <div className="space-y-4">
              {upcomingTests.map((test) => (
                <div key={test.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{test.test_name}</h4>
                      <p className="text-sm text-gray-500">{test.test_description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(test.test_date).toLocaleDateString()} at {test.test_time?.substring(0, 5)}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(test.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Past Tests</h3>
          {pastTests.length === 0 ? (
            <p className="text-gray-500">No past tests recorded</p>
          ) : (
            <div className="space-y-4">
              {pastTests.map((test) => (
                <div key={test.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{test.test_name}</h4>
                      <p className="text-sm text-gray-500">{test.test_description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(test.test_date).toLocaleDateString()} at {test.test_time?.substring(0, 5)}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(test.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MedicalRecordsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
        <p className="text-gray-600 text-sm mb-4">
          View and download your medical records. Medical records are uploaded by your healthcare provider.
        </p>
      </div>
      <MedicalRecordsSection />
    </div>
  );
}

const sidebarItems = [
  { icon: User, label: 'Personal Information', id: 'profile' },
  { icon: FileText, label: 'Medical Records', id: 'medical-records' },
  { icon: Clock, label: 'Appointments', id: 'appointments' },
  { icon: ShoppingBag, label: 'Pharmacy Purchased', id: 'products' },
  { icon: Flask, label: 'Lab Tests', id: 'tests' },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <UserProfile />;
      case 'medical-records':
        return <MedicalRecordsTab />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'products':
        return <PharmacyOrdersSection />;
      case 'tests':
        return <LabTestsSection />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="md:hidden bg-white p-4 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button 
          onClick={toggleMobileMenu} 
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile unless toggled */}
        <div className={`
          ${isMobileMenuOpen ? 'block' : 'hidden'} 
          md:block 
          w-full md:w-64 
          bg-white shadow-md 
          p-4
          md:sticky md:top-0 md:h-screen
        `}>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false); // Close menu after selection on mobile
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3">{item.label}</span>
                  <ArrowUpRight className={`w-4 h-4 ml-auto ${activeSection === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 hidden md:block">Dashboard</h1>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}