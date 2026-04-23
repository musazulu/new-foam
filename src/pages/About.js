// src/pages/About.js
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Welcome to Zimbabwe Bedding E-commerce Platform! We are passionate about providing 
              high-quality bedding solutions that combine comfort, style, and affordability for 
              every Zimbabwean home.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Our mission is to revolutionize the way Zimbabweans shop for bedding products by 
              offering a seamless online shopping experience with premium quality products, 
              competitive pricing, and exceptional customer service.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Locally sourced and manufactured products</li>
              <li>Delivery available across Zimbabwe</li>
              <li>Quality assurance and customer satisfaction guarantee</li>
              <li>Secure payment options</li>
              <li>Responsive customer support</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 mb-6">
              We believe in quality, integrity, and customer satisfaction. Every product we offer 
              is carefully selected to meet our high standards, ensuring you get the best value 
              for your money.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
              <p className="text-blue-800 font-medium">
                "Comfort starts with the right bedding. We're here to make your home more comfortable, 
                one bed at a time."
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;