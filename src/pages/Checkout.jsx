import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import stripePromise from '../services/stripe';
import Loading from '../components/Loading';
import { convertCurrency, formatCurrency } from '../utils/currency';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const ensureUserExists = async (user) => {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!data) {
    const { error } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      role: 'user',
    });

    if (error) throw error;
  }
};


const handleCheckout = async () => {
  setLoading(true);
  try {
    const stripe = await stripePromise;

    await ensureUserExists(user);

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: convertCurrency(getTotal(), 'USD', currency),
        currency,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      variant_id: item.variant?.id ?? null,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    clearCart();
    alert('Order placed successfully!');
    navigate('/orders');

  } catch (error) {
    console.error('Checkout error:', error);
    alert(error.message || 'Checkout failed.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.map(item => (
            <div key={`${item.id}-${item.variant}`} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatCurrency(convertCurrency(item.price * item.quantity, 'USD', currency), currency)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(convertCurrency(getTotal(), 'USD', currency), currency)}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="PKR">PKR</option>
          </select>
          <button
            onClick={handleCheckout}
            className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <Loading size="sm" />}
            Pay with Stripe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;