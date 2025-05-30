import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pharmacyOrders, PharmacyOrder } from '../services/api';
import { format } from 'date-fns';
import { Pill, ChevronDown, ChevronUp } from 'lucide-react';

export default function PharmacyOrdersSection() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user) {
          setLoading(true);
          console.log('Fetching pharmacy orders for user:', user);
          const response = await pharmacyOrders.getAll();
          console.log('API response:', response.data);
          // Filter orders for the current user
          const userOrders = response.data.filter(order => {
            console.log('Comparing order.patient:', order.patient, 'with user.id:', user.id);
            return order.patient === user.id;
          });
          console.log('Filtered user orders:', userOrders);
          setOrders(userOrders);
        }
      } catch (err) {
        console.error('Error fetching pharmacy orders:', err);
        setError('Failed to load your pharmacy orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: PharmacyOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Pill className="w-12 h-12 mx-auto text-blue-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Pharmacy Orders Yet</h3>
        <p className="text-gray-600 mb-4">
          You haven't purchased any pharmacy products yet.
        </p>
        <a
          href="/epharmacy"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Browse Pharmacy
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Pharmacy Orders</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.order_date), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs. {typeof order.total_amount === 'string' 
                      ? parseFloat(order.total_amount).toFixed(2) 
                      : order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                    >
                      {expandedOrder === order.id ? (
                        <>
                          Hide <ChevronUp className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          View <ChevronDown className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <h4 className="font-medium">Order Details</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                  Medicine
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                  Quantity
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                  Price Per Unit
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-2 text-sm">
                                  <div className="flex items-center">
                                    {order.medicine_image && (
                                      <img
                                        src={order.medicine_image}
                                        alt={order.medicine_name}
                                        className="w-10 h-10 object-cover rounded mr-2"
                                      />
                                    )}
                                    {order.medicine_name}
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-sm">{order.quantity}</td>
                                <td className="px-4 py-2 text-sm">Rs. {typeof order.price_per_unit === 'string' 
                                  ? parseFloat(order.price_per_unit).toFixed(2) 
                                  : order.price_per_unit.toFixed(2)}</td>
                                <td className="px-4 py-2 text-sm">
                                  Rs. {typeof order.total_amount === 'string' 
                                    ? parseFloat(order.total_amount).toFixed(2) 
                                    : order.total_amount.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Payment Method:</span>
                          <span className="font-medium text-gray-700">
                            Cash on Delivery
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
