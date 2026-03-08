import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, ShoppingCart, User, Menu, ChevronDown, Bed, Layers, Pill, Sofa, Grid, Home } from 'lucide-react';
import { productService } from '../../services/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const user = useSelector((state) => state?.auth?.user) || null;
  const itemCount = useSelector((state) => state?.cart?.itemCount) || 0;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getCategories();
      
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([
          { id: 1, name: 'Beds', slug: 'bed' },
          { id: 2, name: 'Mattresses', slug: 'mattress' },
          { id: 3, name: 'Pillows', slug: 'pillows' },
          { id: 4, name: 'Lounge Suits', slug: 'lounge-suite' },
          { id: 5, name: 'Headboards', slug: 'headboard' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        { id: 1, name: 'Beds', slug: 'bed' },
        { id: 2, name: 'Mattresses', slug: 'mattress' },
        { id: 3, name: 'Pillows', slug: 'pillows' },
        { id: 4, name: 'Lounge Suits', slug: 'lounge-suite' },
        { id: 5, name: 'Headboards', slug: 'headboard' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getCategoryIcon = (slug) => {
    const iconMap = {
      'bed': <Bed className="w-5 h-5" />,
      'mattress': <Layers className="w-5 h-5" />,
      'pillows': <Pill className="w-5 h-5" />,
      'lounge-suite': <Sofa className="w-5 h-5" />,
      'headboard': <Grid className="w-5 h-5" />,
    };
    return iconMap[slug] || <Bed className="w-5 h-5" />;
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/products?category=${categorySlug}`);
  };

  const safeCategories = Array.isArray(categories) ? categories : [];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-900"></div>
        <div className="h-14 bg-gray-200"></div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center space-x-4">
              {/* Home Logo/Link */}
              <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                <div className="text-2xl font-bold text-white">
                  Bedding<span className="text-red-500">Zim</span>
                </div>
              </Link>
              
              {/* Quick Home Navigation */}
              <Link 
                to="/" 
                className="hidden md:flex items-center text-sm hover:underline"
                title="Go to Home"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/profile" className="hidden md:flex items-center hover:underline">
                  <User className="w-4 h-4 mr-1" />
                  <div className="text-sm">Hello, {user.first_name || user.username}</div>
                </Link>
              ) : (
                <Link to="/login" className="hidden md:flex items-center hover:underline">
                  <User className="w-4 h-4 mr-1" />
                  <div className="text-sm">Hello, sign in</div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left Side - Categories & Home */}
            <div className="flex items-center space-x-6">
              {/* Categories Menu */}
              <div className="relative group">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 px-3 py-2 hover:bg-blue-700 rounded"
                >
                  <Menu className="w-5 h-5" />
                  <span className="font-semibold">Shop Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Categories Dropdown */}
                <div className="absolute left-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl hidden group-hover:block z-50 border border-gray-200">
                  <Link
                    to="/"
                    className="flex items-center px-4 py-3 hover:bg-blue-50 border-b transition-colors"
                  >
                    <div className="text-blue-600 mr-3">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Home</div>
                      <div className="text-sm text-gray-500">Go to homepage</div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/products"
                    className="flex items-center px-4 py-3 hover:bg-blue-50 border-b transition-colors"
                  >
                    <div className="text-blue-600 mr-3">
                      <Grid className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">All Products</div>
                      <div className="text-sm text-gray-500">Browse everything</div>
                    </div>
                  </Link>
                  
                  {safeCategories.map((category) => (
                    <Link
                      key={category.id || category.slug}
                      to={`/products?category=${category.slug}`}
                      className="flex items-center px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors"
                    >
                      <div className="text-blue-600 mr-3">
                        {getCategoryIcon(category.slug)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">Shop {category.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Category Links */}
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition-colors font-medium flex items-center"
                  title="Go to Home"
                >
                  <Home className="w-5 h-5 mr-1" />
                  Home
                </button>
                
                <button
                  onClick={() => handleCategoryClick('bed')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition-colors font-medium"
                >
                  Beds
                </button>
                <button
                  onClick={() => handleCategoryClick('mattress')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition-colors font-medium"
                >
                  Mattresses
                </button>
                <button
                  onClick={() => handleCategoryClick('pillows')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition-colors font-medium"
                >
                  Pillows
                </button>
                <button
                  onClick={() => handleCategoryClick('lounge-suite')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition-colors font-medium"
                >
                  Lounge Suits
                </button>
                <button
                  onClick={() => handleCategoryClick('headboard')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition-colors font-medium"
                >
                  Headboards
                </button>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Link 
                to="/cart" 
                className="relative flex items-center px-3 py-2 hover:bg-blue-700 rounded transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="ml-1 font-semibold hidden md:inline">Cart</span>
              </Link>
              
              {/* User/Login Button */}
              {user ? (
                <Link 
                  to="/profile" 
                  className="flex items-center hover:bg-blue-700 px-3 py-2 rounded transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  <span className="hidden md:inline">{user.first_name || user.username}</span>
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition-colors flex items-center"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex">
            <div className="flex-grow flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search beds, mattresses, pillows, lounge suits, headboards..."
                  className="w-full px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              {/* Quick Navigation Buttons */}
              <div className="ml-4 flex space-x-2">
                <Link
                  to="/products"
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 flex items-center transition-colors"
                  title="Browse All Products"
                >
                  <Grid className="w-5 h-5 mr-2" />
                  <span className="hidden md:inline">All Products</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="px-4 py-3">
            <div className="space-y-1">
              <div className="font-semibold text-blue-700 mb-3 px-2">Navigation</div>
              
              <Link
                to="/"
                className="flex items-center px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="text-blue-600 mr-3">
                  <Home className="w-5 h-5" />
                </div>
                <div className="font-semibold text-gray-900">Home</div>
              </Link>
              
              <Link
                to="/products"
                className="flex items-center px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="text-blue-600 mr-3">
                  <Grid className="w-5 h-5" />
                </div>
                <div className="font-semibold text-gray-900">All Products</div>
              </Link>
              
              <div className="pt-3 border-t mt-3">
                <div className="font-semibold text-blue-700 mb-3 px-2">Shop Categories</div>
                {safeCategories.map((category) => (
                  <Link
                    key={category.id || category.slug}
                    to={`/products?category=${category.slug}`}
                    className="flex items-center px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="text-blue-600 mr-3">
                      {getCategoryIcon(category.slug)}
                    </div>
                    <div className="font-semibold text-gray-900">{category.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;