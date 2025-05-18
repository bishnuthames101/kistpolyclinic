import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { Medicine } from '../types/medicine';
import { medicines } from '../services/api';

export default function CategoryPage() {
  const { category } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [categoryMedicines, setCategoryMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categoryName = category ? category.replace(/([A-Z])/g, ' $1').trim() : '';
  
  useEffect(() => {
    const fetchMedicines = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        // For the category page, we need to convert the URL parameter to the actual category name
        // This is a bit tricky since the URL uses camelCase but the API uses proper case
        // We'll try to fetch by category directly
        const response = await medicines.getByCategory(categoryName);
        
        if (response.data.length === 0) {
          // If no results, try to get all medicines and filter by category
          const allMedicinesResponse = await medicines.getAll();
          const filteredMedicines = allMedicinesResponse.data.filter(med => {
            const normalizedCategory = med.category.toLowerCase().replace(/\s+/g, '');
            const normalizedParam = category.toLowerCase();
            return normalizedCategory === normalizedParam;
          });
          setCategoryMedicines(filteredMedicines);
        } else {
          setCategoryMedicines(response.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medicines for category:', error);
        setError('Failed to load medicines. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMedicines();
  }, [category, categoryName]);

  const handleAddToCart = (medicine: Medicine) => {
    addToCart(medicine);
    showToast(`${medicine.name} added to cart`);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/epharmacy"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ePharmacy
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{categoryName} Medicines</h1>
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

        {/* No Results State */}
        {!loading && !error && categoryMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No medicines found in this category.</p>
          </div>
        )}

        {/* Medicines Grid */}
        {!loading && !error && categoryMedicines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
        )}
      </div>
    </div>
  );
}