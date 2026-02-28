/**
 * CORS Configuration
 * Handles Cross-Origin Resource Sharing settings for API requests
 */

import API_CONFIG from './constants';

/**
 * Get fetch options with CORS configuration
 * @param {Object} customOptions - Custom fetch options to merge
 * @returns {Object} Fetch options with CORS configuration
 */
export const getCorsOptions = (customOptions = {}) => {
  return {
    method: customOptions.method || 'GET',
    headers: {
      ...API_CONFIG.REQUEST.headers,
      ...customOptions.headers,
    },
    credentials: 'include',  // Always include credentials
    ...customOptions,
  };
};

/**
 * Build full API URL
 * In development: uses http://localhost:8080
 * In production: uses relative URL (empty string means same origin)
 * @param {string} endpoint - API endpoint (e.g., '/transactions')
 * @returns {string} Full URL for the API call
 */
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL;

  // If BASE_URL is empty (production with relative URL), return just the endpoint
  if (baseUrl === '') {
    return endpoint;
  }

  // Otherwise combine base URL with endpoint
  return `${baseUrl}${endpoint}`;
};

/**
 * Make an API request with proper CORS and error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export const fetchWithCors = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const fetchOptions = getCorsOptions(options);

  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(`API Response [${endpoint}]:`, data);
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

const corsConfig = {
  getCorsOptions,
  buildApiUrl,
  fetchWithCors,
};

export default corsConfig;

