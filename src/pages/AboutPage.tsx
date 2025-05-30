import { Quote } from 'lucide-react';

export default function AboutPage() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "The care I received at KIST Poly Clinic was exceptional. The staff was professional and caring.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass-card p-8 mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">About KIST Poly Clinic</h1>
              <p className="text-lg text-gray-600">
                KIST Poly Clinic has been serving the community of Lalitpur and beyond since its establishment. 
                Our state-of-the-art facility combines modern medical technology with compassionate care to 
                provide the best possible healthcare services to our patients.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="glass-card p-6 hover:bg-white/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Our Mission</h3>
                <p className="text-gray-600">To provide accessible, high-quality healthcare services with compassion and excellence.</p>
              </div>
              <div className="glass-card p-6 hover:bg-white/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Our Vision</h3>
                <p className="text-gray-600">To be the leading healthcare provider in Nepal, known for exceptional patient care and medical excellence.</p>
              </div>
              <div className="glass-card p-6 hover:bg-white/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Our Values</h3>
                <p className="text-gray-600">Integrity, Excellence, Compassion, Innovation, and Patient-First Approach.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chairperson Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"
                  alt="Mr. Dev Kumar Sah"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-white text-xl font-bold">Mr. Dev Kumar Sah</h3>
                  <p className="text-white/90">Founder & Chairperson</p>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Message from the Chairperson</h2>
                <p className="text-gray-600 mb-6">
                  "As the founder and chairperson of KIST Poly Clinic, I am deeply committed to our mission 
                  of providing exceptional healthcare services to our community. Our journey began with a 
                  vision to create a medical facility that combines advanced technology with compassionate care."
                </p>
                <p className="text-gray-600 mb-6">
                  "We have assembled a team of highly qualified healthcare professionals who share our 
                  commitment to excellence and patient-centered care. Together, we strive to make a positive 
                  impact on the health and well-being of our patients."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                    alt="Signature"
                    className="w-24 h-auto mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">Dev Kumar Sah</h4>
                    <p className="text-gray-600">Founder & Chairperson</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Patient Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="glass hover:bg-white/30 transition-all duration-300 p-6 rounded-lg">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-gray-600 mb-4">{testimonial.text}</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-600">Patient</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Testimonials */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Video Testimonials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass aspect-video rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Video Testimonial 1</p>
                </div>
                <div className="glass aspect-video rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Video Testimonial 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}