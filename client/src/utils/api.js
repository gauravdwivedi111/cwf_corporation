const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Standard utility wrapper for fetch requests to the CWF backend API.
 * Automatically manages JSON body parsing, handles HTTP status codes,
 * and normalizes error objects (especially validation error arrays).
 * 
 * @param {string} endpoint - API path (e.g. '/inquiries')
 * @param {Object} options - Standard fetch options
 * @returns {Promise<any>} - Decoded JSON response payload
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // Default to application/json headers if not multipart/form-data
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // If uploading file (formData), headers must not include Content-Type
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Clear cookie refresh handling status checks (logout/refresh redirection)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'An API error occurred.');
      error.status = response.status;
      error.errors = data.errors || null; // express-validator arrays
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = 'Network error. Unable to establish a connection with the server.';
    }
    throw error;
  }
};
