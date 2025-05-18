import React, { useState } from 'react';
import { Phone, Lock, User, Mail, MapPin } from 'lucide-react'; // <-- import MapPin icon
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

export default function RegisterForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState(''); // <-- New state for address
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Validate phone number format
      const cleanedPhone = phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10 || !cleanedPhone.startsWith('9')) {
        setErrors({ phone: 'Phone number must be 10 digits starting with 9' });
        return;
      }
      
      // Validate password length
      if (password.length < 8) {
        setErrors({ password: 'Password must be at least 8 characters long' });
        return;
      }
      
      // Validate name
      if (!name.trim()) {
        setErrors({ name: 'Name is required' });
        return;
      }
      
      await register(phone, password, name, email, address);
      showToast('Registration successful!', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.data) {
        // Handle validation errors from the server
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          // Handle field-specific errors
          const fieldErrors: Record<string, string> = {};
          Object.entries(errorData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              fieldErrors[key] = value[0];
            } else if (typeof value === 'string') {
              fieldErrors[key] = value;
            }
          });
          setErrors(fieldErrors);
        } else {
          showToast(errorData, 'error');
        }
      } else if (error.message) {
        // Handle client-side validation errors
        showToast(error.message, 'error');
      } else {
        showToast('Registration failed. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="mt-2 text-gray-600">Sign up to book your appointment</p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="sr-only">Phone number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Phone number (98XXXXXXXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="^[9][0-9]{9}$"
                title="Please enter a valid 10-digit phone number starting with 9"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label htmlFor="address" className="sr-only">Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="address"
                name="address"
                type="text"
                required
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign up
          </button>
        </div>

        {/* Already have account */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
