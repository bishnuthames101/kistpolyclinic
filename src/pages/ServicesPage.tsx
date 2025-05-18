
import { Link } from 'react-router-dom';
import { services } from '../data/services';

export default function ServicesPage() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of medical services provided by experienced healthcare professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="mb-4">
                  <Icon className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Available :</h3>
                  <div className="space-y-2">
                    {service.doctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center space-x-2">
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
                  className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700"
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