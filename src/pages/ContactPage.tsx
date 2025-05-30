import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="glass-card inline-block p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get in touch with us for any inquiries about our services or to schedule an appointment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card p-8">
            <form className="space-y-6">
              <div>
                <label className="glass-label">Full Name</label>
                <input type="text" className="glass-input" placeholder="Your name" />
              </div>
              <div>
                <label className="glass-label">Email</label>
                <input type="email" className="glass-input" placeholder="your@email.com" />
              </div>
              <div>
                <label className="glass-label">Phone</label>
                <input type="tel" className="glass-input" placeholder="Your phone number" />
              </div>
              <div>
                <label className="glass-label">Message</label>
                <textarea className="glass-input min-h-[150px]" placeholder="Your message"></textarea>
              </div>
              <button type="submit" className="glass-button w-full">
                Send Message
              </button>
            </form>
          </div>

          {/* Map and Contact Info */}
          <div className="space-y-8">
            <div className="glass-card overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.5194734769757!2d85.33897471029945!3d27.670335084924268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19e605053a21%3A0x1ad5288862579876!2sKist%20Poly%20Clinic!5e0!3m2!1sen!2snp!4v1736154818059!5m2!1sen!2snp"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">Balkumari-Kharibot, Lalitpur, Nepal</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">015202097</p>
                    <p className="text-red-600">Emergency: +977-9808155146, +977-9851050472</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">kistpolyclinic@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}