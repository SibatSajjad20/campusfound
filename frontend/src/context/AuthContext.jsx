import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/config';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check if user is logged in by making a test API call
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user data exists in localStorage
      const userData = localStorage.getItem('userData');
      const userToken = localStorage.getItem('token');
      if (userData) {
        setUser(JSON.parse(userData));
        setToken(userToken);
      } else {
        // Try to fetch user data to verify authentication
        await api.get('/items/lost');
        setUser({ authenticated: true });
      }
    } catch (error) {
      console.log('Not authenticated');
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    if (userToken) {
      localStorage.setItem('token', userToken);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
