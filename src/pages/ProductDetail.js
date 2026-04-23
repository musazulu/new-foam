// src/pages/ProductDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { productService, authService } from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { Star, ShoppingCart, AlertCircle, User } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added this line
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await productService.getProductById(id);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAuthStatus = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const formatPrice = (price) => {
    if (price == null) return '0.00';
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const getAverageRating = (rating) => {
    if (!rating) return '0.0';
    const num = parseFloat(rating);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  const renderStars = (ratingStr) => {
    const rating = parseFloat(ratingStr) || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5 text-yellow-500 fill-current" />
        ))}
        {hasHalfStar && (
          <Star key="half" className="w-5 h-5 text-yellow-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({getAverageRating(ratingStr)} / 5)
        </span>
      </div>
    );
  };

  const handleAddToCart = () => {
    if (!product || !product.is_in_stock) return;

    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        price: parseFloat(product.discounted_price_usd || product.price_usd),
        image: product.primary_image,
        slug: product.slug,
        stock_quantity: product.stock_quantity,
        is_in_stock: product.is_in_stock,
      },
      quantity: 1
    }));

    toast.success('Added to cart!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleRateProduct = async () => {
    if (userRating === 0) {
      toast.error('Please select a rating.');
      return;
    }

    setSubmittingReview(true);
    try {
      await productService.submitReview(id, {
        rating: userRating,
        comment: reviewText.trim() || '',
      });
      
      toast.success('Thank you for your review!');
      fetchProduct();
      setUserRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Review submission error:', error);
      let errorMsg = 'Failed to submit review.';
      
      if (error.response?.status === 401) {
        errorMsg = 'Please log in to submit a review.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      } else if (error.response?.data?.rating) {
        errorMsg = `Rating error: ${error.response.data.rating[0]}`;
      } else if (error.message.includes('Network Error')) {
        errorMsg = 'Cannot connect to server. Please check your connection.';
      }
      
      toast.error(errorMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location.pathname } }); // ✅ Now 'location' is defined
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <ToastContainer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          ← Back to Home
        </Link>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav className="mb-6 text-sm text-gray-600">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link> {' > '}
        <Link to="/products" className="text-blue-600 hover:underline">Products</Link> {' > '}
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center">
          <img
            src={product.primary_image}
            alt={product.name}
            className="max-h-[500px] object-contain"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {product.short_description || 'No description available.'}
          </p>

          <div className="text-2xl font-bold text-green-600 mb-4">
            ${formatPrice(product.discounted_price_usd || product.price_usd)}
            {product.discounted_price_usd && product.price_usd > product.discounted_price_usd && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${formatPrice(product.price_usd)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Customer Reviews</h3>
            {renderStars(product.average_rating)}
            <p className="text-sm text-gray-500 mt-1">
              Based on {product.total_ratings || 0} reviews
            </p>
          </div>

          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              product.is_in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock}
            className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 mb-6 transition-colors ${
              product.is_in_stock
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={20} /> {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Review Section with Auth Check */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Rate This Product</h3>
            
            {isAuthenticated ? (
              <>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`p-1 focus:outline-none ${
                        star <= userRating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      aria-label={`Rate ${star} stars`}
                      disabled={!product.is_in_stock}
                    >
                      <Star size={28} className="fill-current" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-200"
                  rows="3"
                  disabled={!product.is_in_stock}
                />
                <button
                  onClick={handleRateProduct}
                  disabled={userRating === 0 || !product.is_in_stock || submittingReview}
                  className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center ${
                    userRating === 0 || !product.is_in_stock || submittingReview
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {submittingReview ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex flex-col items-center justify-center">
                  <User className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-3">
                    Please <Link to="/login" className="text-blue-600 hover:underline font-medium">log in</Link> to leave a review.
                  </p>
                  <button
                    onClick={handleLoginRedirect}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Log In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Product Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Category:</span> {product.category_name || 'N/A'}</div>
          <div><span className="font-medium">Size:</span> {product.size || 'N/A'}</div>
          <div><span className="font-medium">Material:</span> {product.material || 'N/A'}</div>
          <div><span className="font-medium">Color:</span> {product.color || 'N/A'}</div>
          <div><span className="font-medium">Dimensions:</span> {product.dimensions || 'N/A'}</div>
          <div><span className="font-medium">Weight:</span> {product.weight || 'N/A'} kg</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;