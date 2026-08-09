import { useState, useCallback } from 'react';
import { apiRequest } from '../utils/api.js';

/**
 * Custom React hook to coordinate API network states inside components.
 * Manages loading progress indicators, results data, and server error objects.
 * 
 * @returns {Object} - { data, loading, error, request, setData }
 */
export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(endpoint, options);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    request,
    setData,
  };
};
