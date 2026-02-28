/**
 * API Configuration Constants
 * Centralized configuration for all API endpoints and settings
 */

// API Base URL Configuration
// Uses relative URL so it works in both development and production
const getApiBaseUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Development: backend on port 8080
    return 'http://localhost:8080';
  } else {
    // Production: use relative URL (same domain as frontend)
    // This will use the same origin as the frontend app
    return '';
  }
};

const API_CONFIG = {
  // Backend API Base URL (relative URL for production)
  BASE_URL: getApiBaseUrl(),

  // API Endpoints
  ENDPOINTS: {
    TRANSACTIONS: '/transactions',
  },

  // CORS Configuration
  CORS: {
    origin: true, // Allow any origin in development, backend controls in production
    credentials: 'include',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Request Configuration
  REQUEST: {
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  },

  // Retry Configuration
  RETRY: {
    maxAttempts: 3,
    delayMs: 1000,
  },
};

// Environment-specific overrides
if (process.env.REACT_APP_API_BASE_URL) {
  API_CONFIG.BASE_URL = process.env.REACT_APP_API_BASE_URL;
}

export default API_CONFIG;

