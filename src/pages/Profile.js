// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { User, Settings, Package, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setFormData({
            fullName: userData.full_name || userData.first_name + ' ' + userData.last_name || '',
            email: userData.email || ''
          });
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        // Set default values or redirect to login
        toast.error('Please log in to access your profile');
        navigate('/login');
      } finally {
        setInitialLoad(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for backend (adjust field names based on your API)
      const updateData = {
        first_name: formData.fullName.split(' ')[0] || '',
        last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
        email: formData.email
      };
      
      await authService.updateUser(updateData);
      toast.success('Profile updated successfully!');
      
    } catch (error) {
      console.error('Update error:', error);
      let errorMsg = 'Failed to update profile. Please try again.';
      
      if (error.response?.data?.email) {
        errorMsg = 'Email address is already in use.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
        setTimeout(() => navigate('/login'), 2000);
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="space-y-2">
                <button className="w-full flex items-center px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium">
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </button>
                <button 
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => navigate('/orders')}
                >
                  <Package className="w-5 h-5 mr-3" />
                  Orders
                </button>
                <button 
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => navigate('/wishlist')}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Wishlist
                </button>
                <button 
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <button 
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors ${
                          loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;