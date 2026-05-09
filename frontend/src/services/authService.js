/**
 * Authentication API Service
 * 
 * Functions for user authentication (register, login, profile).
 */

import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response with user data and token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  // Save token and user data to localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

/**
 * Login existing user
 * @param {Object} credentials - Email and password
 * @returns {Promise} - API response with user data and token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  // Save token and user data to localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} - API response with user profile data
 */
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  
  // Update user data in localStorage
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

/**
 * Logout user
 * Clears token and user data from localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user from localStorage
 * @returns {Object|null} - User object or null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
