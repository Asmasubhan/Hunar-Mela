import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-4">
        {cart.map(item => (
          <div key={`${item.id}-${item.variant}`} className="flex items-center border rounded p-4">
            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover mr-4" />
            <div className="flex-grow">
              <h3 className="font-semibold">{item.name}</h3>
              {item.variant && <p className="text-sm text-gray-600">{item.variant.name}</p>}
              <p>${item.price}</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                className="px-2 py-1 border rounded"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                className="px-2 py-1 border rounded"
                disabled={item.quantity >= item.stock_quantity}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id, item.variant)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <p className="text-2xl font-bold">Total: ${getTotal().toFixed(2)}</p>
        <Link to="/checkout" className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 mt-4 inline-block">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;