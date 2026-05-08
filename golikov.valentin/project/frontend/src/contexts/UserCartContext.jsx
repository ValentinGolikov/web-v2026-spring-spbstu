import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const UserCartContext = createContext();

export const useUserCart = () => {
  const context = useContext(UserCartContext);
  if (!context) {
    throw new Error('useUserCart must be used within UserCartProvider');
  }
  return context;
};

export const UserCartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Get cart key based on user login
  const getCartKey = useCallback(() => {
    if (user?.login) {
      return `gadget_hub_cart_${user.login}`;
    }
    return 'gadget_hub_cart_guest';
  }, [user?.login]);

  // Load cart when user changes
  const loadCartForUser = useCallback(() => {
    try {
      const cartKey = getCartKey();
      const saved = localStorage.getItem(cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, [getCartKey]);

  // Save cart for current user
  const saveCartForUser = useCallback((cartItems) => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [getCartKey]);

  // Clear cart for current user
  const clearCartForUser = useCallback(() => {
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
  }, [getCartKey]);

  // Clear all user carts (for logout)
  const clearAllUserCarts = useCallback(() => {
    // Clear current user cart
    const currentKey = getCartKey();
    localStorage.removeItem(currentKey);
    
    // Also clear guest cart
    localStorage.removeItem('gadget_hub_cart_guest');
    
    // You could also iterate through all localStorage keys and remove cart ones
    // but this is simpler for now
  }, [getCartKey]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      // User has logged out, clear all cart data
      clearAllUserCarts();
    }
  }, [isAuthenticated, user, clearAllUserCarts]);

  const value = {
    getCartKey,
    loadCartForUser,
    saveCartForUser,
    clearCartForUser,
    clearAllUserCarts,
  };

  return <UserCartContext.Provider value={value}>{children}</UserCartContext.Provider>;
};