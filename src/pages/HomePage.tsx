import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  Syringe,
  Pill,
  FlaskRound as Flask,
  Phone,
  ChevronRight,
  Clock,
  Truck,
  FileText,
  BadgeCheck
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="glass-card p-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Your Health Is Our{' '}
                  <span className="text-blue-600">Top Priority</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Providing comprehensive healthcare services with modern facilities and experienced medical
                  professionals in Lalitpur, Nepal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/services"
                    className="glass-button"
                  >
                    Book Appointment
                  </Link>
                  <a
                    href="tel:015202097"
                    className="glass-button-secondary"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="glass-card p-2">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80"
                  alt="Doctor consulting with patient"
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="glass-card inline-block p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience healthcare at your doorstep with our premium home services. Professional medical
                care in the comfort of your home.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Doctor Home Visit */}
            <div className="glass-card p-8 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor Home Visit</h3>
              <p className="text-gray-600 mb-4">
                Get expert medical consultation in the comfort of your home. Our qualified doctors will visit you for check-ups, diagnosis, and treatment.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <BadgeCheck className="w-5 h-5 text-green-500 mr-2" />
                  No travel required
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-green-500 mr-2" />
                  Flexible scheduling
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <FileText className="w-5 h-5 text-green-500 mr-2" />
                  Complete medical examination
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">Rs. 2500</span>
                <Link
                  to="/services/doctor-home-visit"
                  className="glass-button"
                >
                  Book Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Home Sample Collection */}
            <div className="glass-card p-8 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                <Syringe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Sample Collection</h3>
              <p className="text-gray-600 mb-4">
                Skip the laboratory queue. Our trained phlebotomists will collect your blood sample at home and deliver results digitally.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <BadgeCheck className="w-5 h-5 text-green-500 mr-2" />
                  Convenient collection
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-green-500 mr-2" />
                  Fast turnaround time
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <FileText className="w-5 h-5 text-green-500 mr-2" />
                  Digital results
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">Rs. 1000</span>
                <Link
                  to="/services/home-sample-collection"
                  className="glass-button"
                >
                  Book Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* ePharmacy */}
            <div className="glass-card p-8 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Pharmacy</h3>
              <p className="text-gray-600 mb-4">
                Order medicines online and get them delivered to your doorstep. Upload prescription and get genuine medicines.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <BadgeCheck className="w-5 h-5 text-green-500 mr-2" />
                  Genuine medicines
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-green-500 mr-2" />
                  Home delivery
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <FileText className="w-5 h-5 text-green-500 mr-2" />
                  Digital prescription
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Free delivery above Rs. 500</span>
                <Link
                  to="/epharmacy"
                  className="glass-button"
                >
                  Order Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Tests Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="glass-card inline-block p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Lab Tests</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get your lab tests done with accurate results. Book tests online and get samples collected at home.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Basic Health Check', 'Diabetes Screening', 'Thyroid Profile', 'Lipid Profile'].map((test) => (
              <Link
                key={test}
                to="/lab-tests"
                className="glass-card p-6 hover:bg-white/30 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-blue-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                  <Flask className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{test}</h3>
                <p className="text-sm text-gray-600 mb-4">Comprehensive test package</p>
                <span className="text-blue-600 font-medium inline-flex items-center">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/lab-tests"
              className="glass-button inline-flex items-center"
            >
              View All Lab Tests
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}