import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import Loading from '../components/Loading';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', user.id);
      if (error) console.error(error);
      else setOrders(data || []);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Please log in to view your orders.</div>;

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="border rounded p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Order #{order.id}</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'processing' ? 'bg-orange-100 text-blue-800' :
              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p>Total: ${order.total_amount} {order.currency}</p>
          <p className="text-sm text-gray-600">Ordered on: {new Date(order.created_at).toLocaleDateString()}</p>
          {order.updated_at && order.updated_at !== order.created_at && (
            <p className="text-sm text-gray-600">Last updated: {new Date(order.updated_at).toLocaleDateString()}</p>
          )}
          <div className="mt-4">
            {order.order_items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.products.name} x {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;