import { Link } from 'react-router-dom';
import { services } from '../data/services';

export default function ServicesPage() {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="glass-card inline-block p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of medical services provided by experienced healthcare professionals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="glass-card p-6 hover:bg-white/30 transition-all duration-300 flex flex-col h-full">
                <div className="w-12 h-12 bg-blue-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Available :</h3>
                  <div className="space-y-2">
                    {service.doctors.map((doctor) => (
                      <div key={doctor.id} className="glass flex items-center space-x-2 p-2 rounded-lg">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.specialty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-600 font-semibold">Rs. {service.price}</span>
                  </div>

                  <Link
                    to={`/services/${service.id}`}
                    className="glass-button w-full text-center"
                  >
                    Learn More & Book
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}