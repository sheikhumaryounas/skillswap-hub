/**
 * Authentication Context
 * 
 * Provides global authentication state and functions throughout the app.
 * Uses React Context API for state management.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, isAuthenticated as checkAuth } from '../services/authService';

// Create the context
const AuthContext = createContext();

/**
 * Custom hook to use auth context
 * Use this in components to access auth state and functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth Provider Component
 * Wrap your app with this component to provide auth context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = () => {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Update user data in state
   * Call this after login, register, or profile update
   */
  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Clear user data from state
   * Call this on logout
   */
  const clearUser = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    updateUser,
    clearUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
