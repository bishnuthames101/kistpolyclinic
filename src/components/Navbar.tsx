import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Menu, X, ShoppingBag, FlaskRound as Flask } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const UserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-gray-700">{user?.name}</span>
      </button>
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            KIST Poly Clinic
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600">Services</Link>
            <Link to="/lab-tests" className="text-gray-700 hover:text-blue-600 flex items-center">
              <Flask className="w-4 h-4 mr-1" />
              Lab Tests
            </Link>
            <Link to="/epharmacy" className="text-gray-700 hover:text-blue-600 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-1" />
              ePharmacy
            </Link>
            
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link to="/lab-tests" className="text-gray-700 hover:text-blue-600 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <Flask className="w-4 h-4 mr-1" />
                Lab Tests
              </Link>
              <Link to="/epharmacy" className="text-gray-700 hover:text-blue-600 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingBag className="w-4 h-4 mr-1" />
                ePharmacy
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 inline-block text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}