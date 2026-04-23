// src/components/products/ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { Heart, Star, ShoppingCart, Check, Image as ImageIcon } from 'lucide-react';
import { getImageUrl, handleImageError, getCategoryIcon } from '../../utils/imageUtils';

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();

  // Get absolute image URL
  const imageUrl = getImageUrl(product.primary_image);
  
  // Get category icon
  const categoryIcon = getCategoryIcon(product.category_name);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        price: product.discounted_price_usd || product.price_usd,
        image: imageUrl,
        slug: product.slug,
        stock_quantity: product.stock_quantity,
        is_in_stock: product.is_in_stock,
      },
      quantity: 1
    }));
    
    setAdded(true);
    setIsAdding(false);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Handle image error
  const handleImageError = (e) => {
    console.warn('Image failed to load:', imageUrl);
    setImageError(true);
    setImageLoaded(false);
    e.target.style.display = 'none';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full">
      {/* Sale Badge */}
      {product.discount_percentage > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
          SAVE {product.discount_percentage}%
        </div>
      )}

      {/* Product Image Container - Fixed height with proper aspect ratio */}
      <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
        {/* ✅ FIXED: Use /product/${product.id} (singular, UUID) */}
        <Link to={`/product/${product.id}`} className="block">
          {/* Image with fixed aspect ratio container */}
          <div className="relative w-full pt-[75%]"> {/* 4:3 aspect ratio (75% = 3/4 * 100) */}
            {/* Loading skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
              </div>
            )}
            
            {/* Error state */}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <ImageIcon className="w-12 h-12 text-gray-300 mb-2" />
                <span className="text-xs text-gray-400 text-center">Image not available</span>
              </div>
            )}
            
            {/* Actual image - Object-fit: contain to show full image */}
            <img
              src={imageUrl}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              style={{
                padding: '8px', // Add padding so images don't touch edges
              }}
            />
          </div>
        </Link>
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-500'}`} />
          </button>
        </div>
        
        {/* Category badge */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded flex items-center">
            <span className="mr-1">{categoryIcon}</span>
            <span className="truncate max-w-[100px]">{product.category_name}</span>
          </div>
        </div>
      </div>

      {/* Product Info - Flex-grow to fill remaining space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        {/* ✅ FIXED: Use /product/${product.id} */}
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 h-12 mb-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(product.average_rating || 0)}
          </div>
          <span className="text-sm text-gray-600">
            ({product.total_ratings || 0})
          </span>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${(product.discounted_price_usd || product.price_usd || 0).toFixed(2)}
            </span>
            {product.discounted_price_usd && product.price_usd > product.discounted_price_usd && (
              <>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.price_usd.toFixed(2)}
                </span>
                <span className="ml-2 text-xs font-semibold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                  Save {product.discount_percentage}%
                </span>
              </>
            )}
          </div>
          
          {/* Delivery */}

        </div>
        
        {/* Stock Status */}
        <div className="mb-4">
          {product.is_in_stock ? (
            <div className="flex items-center text-green-600 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>In Stock</span>
              {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                <span className="ml-2 text-orange-600 font-medium">
                  Only {product.stock_quantity} left!
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center text-red-600 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="font-medium">Out of Stock</span>
            </div>
          )}
        </div>
        
        {/* Quick Specs - Show only if available */}
        {(product.size || product.material || product.color) && (
          <div className="text-xs text-gray-500 mb-4 space-y-1.5 border-t pt-3">
            {product.size && (
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-medium text-gray-700">{product.size}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between">
                <span>Material:</span>
                <span className="font-medium text-gray-700 truncate ml-2 max-w-[100px]">{product.material}</span>
              </div>
            )}
            {product.color && (
              <div className="flex justify-between">
                <span>Color:</span>
                <span className="font-medium text-gray-700">{product.color}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons - At the bottom */}
        <div className="mt-auto pt-4 border-t">
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.is_in_stock || isAdding}
              className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : product.is_in_stock
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : added ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Added!
                </>
              ) : product.is_in_stock ? (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </button>
            
            {/* ✅ FIXED: Use /product/${product.id} */}
            <Link
              to={`/product/${product.id}`}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-4 rounded-md text-sm font-semibold text-center transition-colors flex items-center justify-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;