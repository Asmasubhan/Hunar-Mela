import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  const fetchProduct = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error in fetchProduct:', error);
    }
  }, [id]);

  const fetchVariants = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id);

      if (error) {
        console.error('Error fetching variants:', error);
      } else {
        setVariants(data || []);
      }
    } catch (error) {
      console.error('Error in fetchVariants:', error);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users:user_id (
            email
          )
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error in fetchReviews:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchVariants();
    fetchReviews();
  }, [fetchProduct, fetchVariants, fetchReviews]);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to leave a review');
      return;
    }

    setReviewLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: id,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment
        });

      if (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review');
      } else {
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error in handleSubmitReview:', error);
      alert('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-gray-600">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Category: {product.category}</p>
            {product.material && <p className="text-sm text-gray-500">Material: {product.material}</p>}
            {product.region_culture && <p className="text-sm text-gray-500">Region/Culture: {product.region_culture}</p>}
            <p className="text-sm text-gray-500">Type: {product.product_type}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
          </div>

          <p className="text-3xl font-bold text-green-600 mb-6">${product.price}</p>

          {variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Options:</h3>
              <div className="space-y-2">
                {variants.map(variant => (
                  <label key={variant.id} className="flex items-center">
                    <input
                      type="radio"
                      name="variant"
                      value={variant.id}
                      onChange={() => setSelectedVariant(variant)}
                      className="mr-3"
                    />
                    <span>{variant.name}</span>
                    {variant.price_modifier > 0 && (
                      <span className="ml-2 text-green-600">+${variant.price_modifier}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className={`w-full px-6 py-3 rounded-lg text-lg font-semibold ${
              isInCart(product.id, selectedVariant?.id)
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            } disabled:opacity-50`}
            disabled={product.stock_quantity === 0 || isInCart(product.id, selectedVariant?.id)}
          >
            {product.stock_quantity === 0
              ? 'Out of Stock'
              : isInCart(product.id, selectedVariant?.id)
                ? 'Already in Cart'
                : 'Add to Cart'
            }
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Add Review Form */}
        {user && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="border px-3 py-2 rounded"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full border px-3 py-2 rounded h-24"
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                {reviewLoading && <Loading size="sm" />}
                Submit Review
              </button>
            </form>
          </div>
        )}

        {!user && (
          <div className="bg-orange-50 p-4 rounded-lg mb-8">
            <p className="text-blue-800">Please <a href="/login" className="underline">sign in</a> to leave a review.</p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="font-semibold">{review.users?.email || 'Anonymous'}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;