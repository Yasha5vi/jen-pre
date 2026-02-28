# Configuration Directory

This directory contains all configuration files for the frontend application, including API settings, CORS configuration, and environment-specific variables.

## Files

### `constants.js`
Central configuration file that defines all API-related constants.

**Contents:**
- `BASE_URL` - Backend API base URL (default: `http://localhost:8080`)
- `ENDPOINTS` - API endpoint paths (e.g., `/transactions`)
- `CORS` - CORS configuration object
- `REQUEST` - Default request headers and settings
- `RETRY` - Retry configuration for failed requests

**Usage:**
```javascript
import API_CONFIG from '../config/constants';

console.log(API_CONFIG.BASE_URL);  // http://localhost:8080
console.log(API_CONFIG.ENDPOINTS.TRANSACTIONS);  // /transactions
```

### `corsConfig.js`
Handles CORS configuration and provides helper functions for making API requests.

**Exported Functions:**

1. **`getCorsOptions(customOptions)`**
   - Returns fetch options with CORS configuration
   - Merges custom options with default CORS settings
   
   ```javascript
   const options = getCorsOptions({ method: 'POST' });
   ```

2. **`buildApiUrl(endpoint)`**
   - Builds complete API URL from endpoint
   - Combines BASE_URL with endpoint path
   
   ```javascript
   const url = buildApiUrl('/transactions');  // http://localhost:8080/transactions
   ```

3. **`fetchWithCors(endpoint, options)`**
   - Main function for making API requests
   - Handles CORS, error handling, and response parsing
   - Returns parsed JSON response
   
   ```javascript
   const data = await fetchWithCors('/transactions', { method: 'GET' });
   ```

## Environment Variables

You can override the default `BASE_URL` using environment variables in a `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

The configuration will automatically use the environment variable if it's set.

## CORS Configuration Details

The default CORS configuration includes:

```javascript
{
  origin: 'http://localhost:8080',
  credentials: 'include',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
```

- **origin**: The backend API origin
- **credentials**: Include credentials (cookies) in requests
- **methods**: Allowed HTTP methods
- **allowedHeaders**: Allowed request headers

## Integration with API Modules

All API modules (like `payApi.js`) should:

1. Import `fetchWithCors` and `API_CONFIG`
2. Use `API_CONFIG.ENDPOINTS` for endpoint names
3. Use `fetchWithCors()` for all API requests
4. Handle errors appropriately

## Adding New Endpoints

To add a new API endpoint:

1. Add the endpoint to `constants.js`:
   ```javascript
   ENDPOINTS: {
     TRANSACTIONS: '/transactions',
     USERS: '/users',  // New endpoint
   }
   ```

2. Create or update API module to use it:
   ```javascript
   const data = await fetchWithCors(API_CONFIG.ENDPOINTS.USERS, { method: 'GET' });
   ```

## Troubleshooting

### CORS Errors
- Ensure backend is running on `http://localhost:8080`
- Check that `@CrossOrigin` is configured on backend controller
- Verify `BASE_URL` matches backend URL

### API Request Failures
- Check browser console for error messages
- Verify endpoint paths are correct
- Ensure request headers are properly set
- Check that request body is valid JSON

## Future Enhancements

- [ ] Add authentication/JWT token handling
- [ ] Add request retry logic
- [ ] Add request/response interceptors
- [ ] Add API response caching
- [ ] Add request timeout handling

