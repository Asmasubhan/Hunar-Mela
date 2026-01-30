import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowMessage(true);
    
    // Message ko 3 seconds baad hide kar do
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md relative">
      {/* Success Message */}
      {showMessage && (
        <div className="absolute top-2 left-2 right-2 bg-orange-100 border border-orange-400 text-orange-700 px-3 py-2 rounded z-10 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Product added to your cart.</span>
          </div>
        </div>
      )}
      
      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover mb-4" />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">${product.price}</p>
      <div className="flex justify-between">
        <Link to={`/products/${product.id}`} className="text-orange-500 hover:underline">
          View Details
        </Link>
        <button
          onClick={handleAddToCart}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;