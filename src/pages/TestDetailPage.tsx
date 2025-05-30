import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { labTests } from '../data/labTests';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { laboratoryTests } from '../services/api';

export default function TestDetailPage() {
  const { id } = useParams();
  const test = labTests.find(t => t.id === id);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showBooking, setShowBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Get tomorrow's date as minimum date for booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 30 days from now as maximum date for booking
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleBooking = () => {
    if (!user) {
      showToast('Please login to book a test', 'error');
      return;
    }
    setShowBooking(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      showToast('Please select date and time', 'error');
      return;
    }
    setShowConfirmation(true);
  };

  const handleFinalConfirmation = async () => {
    if (!user || !test) {
      showToast('Please login to book a test', 'error');
      return;
    }

    try {
      const formattedTime = selectedTime + ':00';
      
      const testData = {
        test_name: test.name,
        test_description: test.description,
        test_date: selectedDate,
        test_time: formattedTime,
        patient_id: user.id
      };

      await laboratoryTests.create(testData);
      showToast('Test booking confirmed successfully!', 'success');
      setShowBooking(false);
      setShowConfirmation(false);
      setSelectedDate('');
      setSelectedTime('');
    } catch (error: any) {
      console.error('Failed to book test:', error);
      let errorMessage = 'Failed to book test';
      
      if (error.response) {
        if (error.response.data) {
          // If we have specific error details
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (typeof error.response.data === 'object') {
            // If we have field-specific errors
            const errorDetails = Object.entries(error.response.data)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ');
            errorMessage = errorDetails || errorMessage;
          }
        } else if (error.response.status === 401) {
          errorMessage = 'Please login to book a test';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to book this test';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid test booking data';
        }
      }
      
      showToast(errorMessage, 'error');
    }
  };

  if (!test) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Not Found</h1>
            <Link to="/lab-tests" className="text-blue-600 hover:text-blue-800">
              View All Tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/lab-tests"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Laboratory Tests
          </Link>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.name}</h1>
              <p className="text-gray-600 mb-6">{test.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <div>
                    <p className="font-medium">Turnaround Time</p>
                    <p>{test.turnaroundTime}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <div>
                    <p className="font-medium">Requirements</p>
                    <p>{test.requirements}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">Rs. {test.price}</span>
                <button
                  onClick={handleBooking}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Book Test</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                min={minDate}
                max={maxDateStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBooking(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Confirm Booking</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Test</p>
                <p className="font-medium">{test.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">
                  {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">Rs. {test.price}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="font-medium text-gray-800">Payment Method</p>
                <p className="text-gray-600">Pay on Visit</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleFinalConfirmation}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
