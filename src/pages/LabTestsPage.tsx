import { Link } from 'react-router-dom';
import { Clock, FileText, AlertCircle } from 'lucide-react';
import { labTests, testPackages } from '../data/labTests';

export default function LabTestsPage() {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="glass-card inline-block p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Laboratory Tests</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get accurate and reliable diagnostic tests with quick turnaround times.
              Our state-of-the-art laboratory ensures precise results for better healthcare decisions.
            </p>
          </div>
        </div>

        {/* Popular Tests Section */}
        <div className="mb-16">
          <div className="glass-card p-6 mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Popular Tests</h2>
              <Link to="/lab-tests/all" className="text-blue-600 hover:text-blue-800">
                View All Tests
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labTests.slice(0, 4).map((test) => (
              <div key={test.id} className="glass-card p-6 hover:bg-white/30 transition-all duration-300">
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
                    to={`/lab-tests/test/${test.id}`}
                    className="glass-button"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Packages Section */}
        <div>
          <div className="glass-card p-6 mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Health Packages</h2>
              <Link to="/lab-tests/packages" className="text-blue-600 hover:text-blue-800">
                View All Packages
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testPackages.slice(0, 4).map((pkg) => (
              <div key={pkg.id} className="glass-card p-6 hover:bg-white/30 transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                <div className="space-y-2">
                  <div className="flex items-start text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Includes:</p>
                      <ul className="list-disc list-inside pl-2">
                        {pkg.tests.slice(0, 3).map((test, index) => (
                          <li key={index}>{test}</li>
                        ))}
                        {pkg.tests.length > 3 && (
                          <li>+{pkg.tests.length - 3} more tests</li>
                        )}
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
                    to={`/lab-tests/package/${pkg.id}`}
                    className="glass-button"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}