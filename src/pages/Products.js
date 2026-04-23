// src/pages/Products.js
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import { Filter, X, AlertCircle, RefreshCw } from 'lucide-react';
import { processProductImages } from '../utils/imageUtils';

// Updated FALLBACK_CATEGORIES to match your database slugs exactly
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Bed', slug: 'bed' },
  { id: 2, name: 'Mattresses', slug: 'mattresses' },
  { id: 3, name: 'Headboard', slug: 'headboard' },
  { id: 4, name: 'Lounge Suite', slug: 'lounge-suite' },
  { id: 5, name: 'Pillows', slug: 'pillows' },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'created_at',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: '' });

  // Fetch categories and test API on mount
  useEffect(() => {
    testApiConnection();
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const testApiConnection = async () => {
    try {
      const response = await productService.getProducts({ page: 1, page_size: 1 });
      setApiStatus({
        connected: true,
        message: `API connected successfully (${response.status})`
      });
    } catch (error) {
      setApiStatus({
        connected: false,
        message: `API connection failed: ${error.message}`
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      console.log('Categories API response:', response.data);

      let categoriesData = [];

      // DRF returns paginated response: { count, results, ... }
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        categoriesData = response.data.results;
      } else if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      }

      if (categoriesData.length === 0) {
        console.log('Using fallback categories');
        setCategories(FALLBACK_CATEGORIES);
      } else {
        console.log('Setting categories from API:', categoriesData);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.log('Using fallback categories due to error');
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;
      if (filters.rating) params.rating = filters.rating;

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_low_high': params.ordering = 'price_usd'; break;
          case 'price_high_low': params.ordering = '-price_usd'; break;
          case 'rating': params.ordering = '-average_rating'; break;
          case 'popular': params.ordering = '-total_sold'; break;
          default: params.ordering = '-created_at';
        }
      }

      const response = await productService.getProducts(params);
      const productsData = response.data.results || [];
      const processedProducts = productsData.map(product => processProductImages(product));
      setProducts(processedProducts);
      if (processedProducts.length === 0) setError('No products found matching your criteria.');

    } catch (error) {
      console.error('Error fetching products:', error);
      let errorMessage = 'Failed to load products. ';
      if (error.response) {
        switch (error.response.status) {
          case 404: errorMessage += 'API endpoint not found.'; break;
          case 500: errorMessage += 'Server error.'; break;
          default: errorMessage += `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage += 'Cannot connect to server. Make sure backend is running.';
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.rating, filters.sortBy]);

  const handleFilterChange = (key, value) => {
    console.log(`Filter change: ${key} = ${value}`);
    setFilters(prev => ({ ...prev, [key]: value }));

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    navigate(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'created_at',
    });
    navigate('/products');
  };

  const getCategoryName = (slug) => {
    if (!slug) return 'All Products';
    
    const category = [...categories, ...FALLBACK_CATEGORIES].find(cat => cat.slug === slug);
    return category ? category.name : slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const safeCategories = Array.isArray(categories) ? categories : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {!apiStatus.connected && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">{apiStatus.message}</span>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* API Status Banner */}
      {!apiStatus.connected && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">{apiStatus.message}</span>
              </div>
              <button
                onClick={testApiConnection}
                className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getCategoryName(filters.category)}
              </h1>
              {filters.search && (
                <p className="text-gray-600 mt-2">
                  Search results for: <span className="font-semibold">"{filters.search}"</span>
                </p>
              )}
              <p className="text-gray-500 mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
              {apiStatus.connected && (
                <p className="text-sm text-green-600 mt-1">✓ API Connected</p>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className={`block w-full text-left px-3 py-2 rounded ${!filters.category ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
                  >
                    All Categories
                  </button>
                  {safeCategories.map((category) => (
                    <button
                      key={category.id || category.slug}
                      onClick={() => handleFilterChange('category', category.slug)}
                      className={`block w-full text-left px-3 py-2 rounded ${filters.category === category.slug ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range (USD)</h3>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max $"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                {(filters.minPrice || filters.maxPrice) && (
                  <button
                    onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear price filter
                  </button>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Minimum Rating</h3>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4 Stars & Up</option>
                  <option value="3">3 Stars & Up</option>
                  <option value="2">2 Stars & Up</option>
                  <option value="1">1 Star & Up</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <span className="text-gray-600">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="ml-2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="created_at">Newest Arrivals</option>
                    <option value="price_low_high">Price: Low to High</option>
                    <option value="price_high_low">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={fetchProducts}
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                    title="Refresh products"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Error or Empty State */}
            {error ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unable to Load Products</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={fetchProducts}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={clearFilters}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.rating
                    ? "Try adjusting your filters or search term"
                    : "No products are available in this category"}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  Browse All Products
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More (for pagination) */}
                {products.length >= 20 && (
                  <div className="mt-8 text-center">
                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50">
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;