/**
 * API Service Configuration
 * 
 * This file sets up axios instance with base URL and authentication headers.
 * All API calls to the backend go through this service.
 */

import axios from 'axios';

// Base URL for the backend API
// Change this to your deployed backend URL in production
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to headers
 * Automatically adds the token from localStorage to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors globally
 * Automatically logs out user if token is invalid (401 error)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
