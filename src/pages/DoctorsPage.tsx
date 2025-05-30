import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function DoctorsPage() {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="glass-card inline-block p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Medical Team</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our team of experienced and dedicated medical professionals committed to providing you with the highest quality healthcare.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="glass-card hover:bg-white/30 transition-all duration-300">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-64 object-cover object-center rounded-t-lg"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{doctor.name}</h2>
                <p className="text-blue-600 font-semibold mb-4">{doctor.specialty}</p>
                
                <div className="space-y-3 text-gray-600">
                  <p><strong>Education:</strong> {doctor.education}</p>
                  <p><strong>Experience:</strong> {doctor.experience}</p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <p>{doctor.schedule}</p>
                  </div>
                  <p><strong>Consultation Fee:</strong> Rs. {doctor.opdCharge}</p>
                </div>

                <div className="mt-6">
                  <Link 
                    to={`/doctors/${doctor.id}`} 
                    className="glass-button w-full flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}