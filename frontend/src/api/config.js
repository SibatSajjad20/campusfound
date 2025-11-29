import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

if (!API_BASE_URL) {
  console.error('VITE_API_URL is not defined in environment variables');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry logic
axiosRetry(api, {
  retries: 5,
  retryDelay: (retryCount) => Math.min(retryCount * 3000, 10000),
  retryCondition: (error) => {
    return axiosRetry.isNetworkError(error) || 
           error.response?.status === 429 || 
           error.response?.status === 503 || 
           error.response?.status === 502 ||
           error.code === 'ECONNABORTED' ||
           error.code === 'ERR_NETWORK';
  },
});

// Add token to requests if available
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

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/';
      }
    }
    
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    } else if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
