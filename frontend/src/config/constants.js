/**
 * API Configuration Constants
 * Centralized configuration for all API endpoints and settings
 *
 * Environments:
 * - Development: localhost:8080 (direct backend)
 * - Docker: localhost/api (through nginx reverse proxy)
 * - Production: relative URL /api (through reverse proxy)
 */

const getApiBaseUrl = () => {
  const environment = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV;

  // Production: use relative URL with /api prefix (reverse proxy)
  if (environment === 'production') {
    return '/api';
  }

  // Docker/Container (Jenkins CI/CD, Docker Compose): use reverse proxy URL
  if (environment === 'docker' || environment === 'container') {
    return 'http://localhost/api';
  }

  // Development: direct backend communication
  return 'http://localhost:8080';
};

const API_CONFIG = {
  // Backend API Base URL
  BASE_URL: getApiBaseUrl(),

  // API Endpoints
  ENDPOINTS: {
    TRANSACTIONS: '/transactions',
  },

  // CORS Configuration
  CORS: {
    origin: true,
    credentials: 'include',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Request Configuration
  REQUEST: {
    timeout: 30000,
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

if (process.env.REACT_APP_API_BASE_URL) {
  API_CONFIG.BASE_URL = process.env.REACT_APP_API_BASE_URL;
}

export default API_CONFIG;

