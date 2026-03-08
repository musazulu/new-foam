import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Terms of Service</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              Welcome to BeddingZim. By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-6">
              Permission is granted to temporarily download one copy of the materials (information or software) on BeddingZim's website for personal, non-commercial transitory viewing only.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Account</h2>
            <p className="text-gray-700 mb-6">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Product Information</h2>
            <p className="text-gray-700 mb-6">
              We strive to ensure that product descriptions, images, and prices are accurate. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              BeddingZim shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products.
            </p>
            
            <div className="mt-8 pt-6 border-t">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;