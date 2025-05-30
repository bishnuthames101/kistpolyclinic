import { Phone, Mail, MapPin, Clock, Facebook, Instagram} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">KIST Poly Clinic</h3>
            <p className="mb-4">Providing quality healthcare services with modern facilities and experienced professionals.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/16mp3AtNCs/?mibextid=wwXIfr" className="hover:text-blue-400"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/kistpolyclinic8?igsh=MXB0c2tsN3o0aGphNQ%3D%3D&utm_source=qr" className="hover:text-blue-400"><Instagram size={20} /></a>
              <a href="https://www.tiktok.com/@kistpolyclinic?_t=ZS-8un3nxG06Ip&_r=1" className="hover:text-blue-400"><FaTiktok size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="/doctors" className="hover:text-blue-400">Our Doctors</a></li>
              <li><a href="/services" className="hover:text-blue-400">Book Appointment</a></li>
              <li><a href="/lab-tests" className="hover:text-blue-400">Book Lab Test</a></li>
              <li><a href="/epharmacy" className="hover:text-blue-400">Purchase Pharmacy Items</a></li>
              <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                +977-01-5202097
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                kistpolyclinic@gmail.com
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>Balkumari-Kharibot,<br />Lalitpur, Nepal</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Working Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock size={16} className="mr-2" />
                Sun - Sat: 7:00 AM - 8:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} KIST Poly Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}