import { Link } from 'react-router-dom';
import { Clock, FileText, ArrowLeft } from 'lucide-react';
import { testPackages } from '../data/labTests';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function AllPackagesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleBookNow = () => {
    if (!user) {
      showToast('Please login to book a package', 'error');
      return;
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/lab-tests"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Laboratory Tests
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">All Health Packages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{pkg.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
              <div className="space-y-2">
                <div className="flex items-start text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2 mt-1" />
                  <div>
                    <p className="font-medium mb-1">Includes:</p>
                    <ul className="list-disc list-inside pl-2">
                      {pkg.tests.map((test, index) => (
                        <li key={index}>{test}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {pkg.turnaroundTime}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 font-semibold">Rs. {pkg.price}</span>
                <Link
                  to={user ? `/lab-tests/package/${pkg.id}` : '/login'}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      handleBookNow();
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Book Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}