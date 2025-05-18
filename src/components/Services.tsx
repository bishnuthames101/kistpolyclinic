import React from 'react';
import { Heart, Brain, Stethoscope, Baby, Microscope, Home, Syringe, Truck } from 'lucide-react';

const services = [
  {
    icon: <Heart className="w-12 h-12 text-blue-600" />,
    title: 'Cardiology',
    description: 'Comprehensive heart care services with modern diagnostic facilities.'
  },
  {
    icon: <Brain className="w-12 h-12 text-blue-600" />,
    title: 'Neurology',
    description: 'Expert neurological care for various brain and nervous system conditions.'
  },
  {
    icon: <Stethoscope className="w-12 h-12 text-blue-600" />,
    title: 'General Medicine',
    description: 'Primary healthcare services for all age groups.'
  },
  {
    icon: <Baby className="w-12 h-12 text-blue-600" />,
    title: 'Pediatrics',
    description: 'Specialized medical care for infants, children, and adolescents.'
  },
  {
    icon: <Home className="w-12 h-12 text-blue-600" />,
    title: 'Home Visit',
    description: 'Professional medical care in the comfort of your home with experienced doctors.'
  },
  {
    icon: <Syringe className="w-12 h-12 text-blue-600" />,
    title: 'Home Sample Collection',
    description: 'Convenient blood sample collection at your doorstep with quick results via email.'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of medical services to meet all your healthcare needs
            with state-of-the-art facilities and experienced professionals, including convenient home healthcare services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}