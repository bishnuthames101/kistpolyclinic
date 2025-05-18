import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    education: "MD - Cardiology, MBBS",
    experience: "15+ years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    schedule: "Mon, Wed, Fri: 10AM - 4PM",
    opdCharge: 1000
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    education: "MD - Neurology, MBBS",
    experience: "12+ years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    schedule: "Tue, Thu, Sat: 9AM - 3PM",
    opdCharge: 1000
  },
  {
    id: 3,
    name: "Dr. Emily Patel",
    specialty: "Pediatrician",
    education: "MD - Pediatrics, MBBS",
    experience: "10+ years",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
    schedule: "Mon-Fri: 9AM - 1PM",
    opdCharge: 1000
  }
];

export default function DoctorProfile() {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === Number(id));
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showBooking, setShowBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00'
  ];

  const handleBooking = () => {
    if (!user) {
      showToast('Please login to book an appointment', 'error');
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

  const handleFinalConfirmation = () => {
    showToast('Appointment booked successfully!', 'success');
    setShowBooking(false);
    setShowConfirmation(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  if (!doctor) {
    return (
      <div className="py-16 bg-gray-50 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
        <Link to="/doctors" className="text-blue-600 hover:text-blue-800">
          View All Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/doctors" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-8">
          <img src={doctor.image} alt={doctor.name} className="w-60 h-60 object-cover rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
            <p className="text-blue-600 text-xl font-semibold mb-4">{doctor.specialty}</p>

            <div className="space-y-2 text-gray-700 mb-6">
              <p><strong>Education:</strong> {doctor.education}</p>
              <p><strong>Experience:</strong> {doctor.experience}</p>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <p>{doctor.schedule}</p>
              </div>
              <p><strong>Consultation Fee:</strong> Rs. {doctor.opdCharge}</p>
            </div>

            <button
              onClick={handleBooking}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>

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
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
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
      <h2 className="text-2xl font-bold mb-6">Confirm Appointment</h2>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Doctor</p>
          <p className="font-medium">{doctor.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Specialty</p>
          <p className="font-medium">{doctor.specialty}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date & Time</p>
          <p className="font-medium">
            {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Consultation Fee</p>
          <p className="font-medium">Rs. {doctor.opdCharge}</p> {/* <-- Added OPD charge here */}
        </div>
        <div className="pt-4 border-t">
          <p className="font-medium text-gray-800">Payment Method</p>
          <p className="text-gray-600">Cash on Delivery</p>
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
