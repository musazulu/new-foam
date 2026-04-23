// src/services/api.js
import axios from 'axios';

// Use environment variable or default to localhost
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';
const API_URL = process.env.REACT_APP_API_URL || `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor with better auth handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with auto token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  getCurrentUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
      const response = await api.get('/accounts/me/');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
};

// Product Service
export const productService = {
  getProducts: (params = {}) => {
    console.log('API: Fetching products from', `${API_URL}/products/`);
    return api.get('/products/', { params });
  },

  getProductById: (id) => {
    console.log('API: Fetching product by ID:', id);
    return api.get(`/products/${id}/`);
  },

  getCategories: () => {
    console.log('API: Fetching categories from', `${API_URL}/categories/`);
    return api.get('/categories/');
  },

  getFeatured: () => api.get('/products/featured/'),
  getSponsored: () => api.get('/products/sponsored/'),
  searchProducts: (data) => api.post('/products/search/', data),
  likeProduct: (id) => api.post(`/products/${id}/like/`),

  // Reviews
  getReviews: (id) => api.get(`/products/${id}/reviews/`),
  submitReview: (id, data) => {
    console.log('API: Submitting review for product:', id, 'Data:', data);
    return api.post(`/products/${id}/reviews/`, data);
  },
};

export default api;