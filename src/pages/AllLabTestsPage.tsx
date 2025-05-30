import { Link } from 'react-router-dom';
import { Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { labTests } from '../data/labTests';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function AllLabTestsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleBookNow = () => {
    if (!user) {
      showToast('Please login to book a test', 'error');
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
          <h1 className="text-3xl font-bold text-gray-800 mt-4">All Laboratory Tests</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labTests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{test.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{test.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {test.turnaroundTime}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {test.requirements}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 font-semibold">Rs. {test.price}</span>
                <Link
                  to={user ? `/lab-tests/test/${test.id}` : '/login'}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      handleBookNow();
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}