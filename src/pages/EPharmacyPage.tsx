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
        // Get all categories
        const categoriesResponse = await medicines.getCategories();
        const categories = categoriesResponse.data;
        
        // Fetch medicines for each category
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
      // With the updated API, we need to create one order per medicine item
      // Create a separate order for each item in the cart
      for (const item of items) {
        console.log('Creating order for:', item.name);
        
        // Create the order through the API
        const response = await pharmacyOrders.create({
          patient_id: user.id,
          medicine_name: item.name,
          quantity: item.quantity,
          price_per_unit: item.price,
          medicine_image: item.image,
          total_amount: item.quantity * item.price
        });
        
        console.log('Order created successfully:', response.data);
      }
      
      showToast('Order placed successfully! Our team will contact you for payment and delivery.', 'success');
      clearCart();
      setShowCart(false);
    } catch (error: any) {
      console.error('Error placing order:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('Status Code:', error.response.status);
      }
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Online Pharmacy</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({items.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading medicines...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Categories */}
        {!loading && !error && (
          <div className="grid gap-8">
            {Object.entries(medicineData).map(([category, categoryMedicines]) => (
              <div key={category} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
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
                  {categoryMedicines.slice(0, 2).map((medicine) => (
                  <div key={medicine.id} className="bg-white border rounded-lg overflow-hidden">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{medicine.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{medicine.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-semibold">Rs. {medicine.price}</span>
                        <button
                          onClick={() => handleAddToCart(medicine)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add to Cart
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Stock: {medicine.stock} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
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
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="ml-4">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-gray-500">Rs. {item.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold">Rs. {total}</span>
                      </div>
                      <button
                        onClick={handleOrder}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      >
                        {user ? 'Place Order' : 'Login to Order'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}