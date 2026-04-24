import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import { ChevronRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [sponsoredProducts, setSponsoredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredRes, sponsoredRes, categoriesRes] = await Promise.all([
        productService.getFeatured(),
        productService.getSponsored(),
        productService.getCategories()
      ]);
      
      setFeaturedProducts(featuredRes.data);
      setSponsoredProducts(sponsoredRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-amazon-light">
      {/* Hero Carousel */}
      <div className="relative bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Premium Bedding for Restful Nights
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Discover Zimbabwe's largest collection of beds, mattresses, and luxury bedding. 
                Quality comfort delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products?category=mattresses"
                  className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors border-2 border-white"
                >
                  View Mattresses
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/images/new-foam-ad.png"
                alt="Luxury Bedroom"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
<div className="max-w-7xl mx-auto px-4 py-12">
  <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {[
      { name: 'Beds', slug: 'beds', icon: '🛏️', desc: 'Luxury beds' },
      { name: 'Mattresses', slug: 'mattresses', icon: '🛌', desc: 'Comfort sleep' },
      { name: 'Pillows', slug: 'pillows', icon: '💤', desc: 'Soft support' },
      { name: 'Lounge Suits', slug: 'lounge-suits', icon: '🛋️', desc: 'Relaxation' },
      { name: 'Headboards', slug: 'headboards', icon: '🖼️', desc: 'Elegant designs' },
    ].map((category) => (
      <Link
        key={category.slug}
        to={`/products?category=${category.slug}`}
        className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg hover:border-blue-500 transition-all group"
      >
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
          {category.icon}
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
        <p className="text-sm text-gray-500">{category.desc}</p>
        <div className="mt-3 text-sm text-blue-600 group-hover:text-blue-800">
          Shop Now →
        </div>
      </Link>
    ))}
  </div>
</div>
      {/* Featured Products - Amazon Style */}
      <div className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Today's Deals</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-800 font-semibold">
              See all deals <ChevronRight className="inline w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Choose BeddingZim?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <Truck className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Nationwide Delivery</h3>
            <p className="text-gray-600">Delivery available across Zimbabwe</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">100% satisfaction guarantee with 1-year warranty</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <CreditCard className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
            <p className="text-gray-600">All major Zimbabwean payment methods accepted</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <Headphones className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600">Customer support available round the clock</p>
          </div>
        </div>
      </div>

      {/* Sponsored Products */}
      {sponsoredProducts.length > 0 && (
        <div className="bg-amazon-gray py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Sponsored Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sponsoredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Best Sellers */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Best Sellers in Bedding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product, index) => (
            <div key={product.id} className="relative">
              {index < 3 && (
                <div className="absolute top-2 left-2 bg-secondary-600 text-white text-xs font-bold px-2 py-1 rounded">
                  #{index + 1} Best Seller
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Sleep?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join over 10,000 satisfied customers who trust BeddingZim for premium bedding solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;