import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const LS_TOKEN_KEY = 'gadget_hub_token';
const LS_USER_KEY = 'gadget_hub_user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem(LS_TOKEN_KEY);
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem(LS_TOKEN_KEY) || null;
  });

  // Restore axios auth header on mount if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem(LS_TOKEN_KEY);
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials);
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;

        setIsAuthenticated(true);
        setUser(newUser);
        setToken(newToken);

        localStorage.setItem(LS_TOKEN_KEY, newToken);
        localStorage.setItem(LS_USER_KEY, JSON.stringify(newUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);

    // Clear auth data
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_KEY);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
