// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Badges */}
      <div className="bg-white text-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Truck className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Nationwide Delivery</h3>
              <p className="text-sm text-gray-600">Across Zimbabwe</p>
            </div>
            <div className="text-center">
              <Shield className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600">100% Satisfaction</p>
            </div>

            <div className="text-center">
              <CreditCard className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">EcoCash & Cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Get to Know Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:underline text-white">
                  About Us
                </Link>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Careers
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Blog
                </span>
              </li>
              <li>
                <Link to="/contact" className="hover:underline text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Make Money with Us</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Sell on NewFoam
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Affiliate Program
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Advertise Your Products
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Payment Methods</h3>
            <ul className="space-y-2">
              <li>EcoCash</li>
              <li>OneMoney</li>
              <li>ZIPIT</li>
              <li>Bank Transfer</li>
              <li>Visa/MasterCard</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Let Us Help You</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Track Your Order
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Returns & Refunds
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Delivery Information
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold">
                New<span className="text-red-500">Foam</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Zimbabwe's #1 Bedding Store</p>
            </div>
            
            <div className="flex space-x-4">
              <span className="text-gray-400 cursor-not-allowed">Terms & Conditions</span>
              <span className="text-gray-400 cursor-not-allowed">Privacy Policy</span>
              <span className="text-gray-400 cursor-not-allowed">Cookies</span>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400">© 2026 NewFoam. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;