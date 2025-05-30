import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Medicine } from '../types/medicine';
import { pharmacyOrders, medicines } from '../services/api';

export default function EPharmacyPage() {
  const { items, addToCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineData, setMedicineData] = useState<Record<string, Medicine[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await medicines.getCategories();
        const categories = categoriesResponse.data;
        
        const medicinesByCategory: Record<string, Medicine[]> = {};
        
        for (const category of categories) {
          const response = await medicines.getByCategory(category);
          const categoryKey = category.toLowerCase().replace(/\s+/g, '');
          medicinesByCategory[categoryKey] = response.data;
        }
        
        setMedicineData(medicinesByCategory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setError('Failed to load medicines. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMedicines();
  }, []);

  const handleAddToCart = (medicine: Medicine) => {
    addToCart(medicine);
    showToast(`${medicine.name} added to cart`);
  };

  const handleOrder = async () => {
    if (!user) {
      setShowCart(false);
      navigate('/login');
      return;
    }

    try {
      for (const item of items) {
        await pharmacyOrders.create({
          patient_id: user.id,
          medicine_name: item.name,
          quantity: item.quantity,
          price_per_unit: item.price,
          medicine_image: item.image,
          total_amount: item.quantity * item.price
        });
      }
      
      showToast('Order placed successfully!', 'success');
      clearCart();
      setShowCart(false);
    } catch (error: any) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="glass-card p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Online Pharmacy</h1>
            <button
              onClick={() => setShowCart(!showCart)}
              className="glass-button"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({items.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines..."
                className="glass-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass-card p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading medicines...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card p-12 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="glass-button mt-4"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Categories */}
        {!loading && !error && (
          <div className="space-y-8">
            {Object.entries(medicineData).map(([category, categoryMedicines]) => (
              <div key={category} className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h2>
                  <Link
                    to={`/epharmacy/category/${category}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryMedicines.slice(0, 3).map((medicine) => (
                    <div key={medicine.id} className="glass-card p-4 hover:bg-white/30 transition-all duration-300">
                      <img
                        src={medicine.image}
                        alt={medicine.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{medicine.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{medicine.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-semibold">Rs. {medicine.price}</span>
                        <button
                          onClick={() => handleAddToCart(medicine)}
                          className="glass-button"
                        >
                          Add to Cart
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Stock: {medicine.stock} units</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="absolute right-0 top-0 h-full w-full max-w-md">
              <div className="glass-card h-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <button
                      onClick={() => setShowCart(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {items.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {items.map((item) => (
                          <div key={item.id} className="glass p-4 rounded-lg">
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="ml-4 flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-gray-500">Rs. {item.price}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="glass-button-secondary p-1"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="glass-button-secondary p-1"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between mb-4">
                          <span className="font-semibold">Total:</span>
                          <span className="font-semibold">Rs. {total}</span>
                        </div>
                        <button
                          onClick={handleOrder}
                          className="glass-button w-full"
                        >
                          {user ? 'Place Order' : 'Login to Order'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}