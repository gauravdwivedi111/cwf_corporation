import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import { useCallback } from 'react';

/**
 * useAuthApi provides a wrapper around the client apiRequest utility.
 * It dynamically injects the in-memory Authorization header without storing
 * sensitive strings in permanent browser storage.
 */
export const useAuthApi = () => {
  const { token } = useAuth();

  const authRequest = useCallback(
    async (endpoint, options = {}) => {
      const headers = {
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return apiRequest(endpoint, {
        ...options,
        headers,
      });
    },
    [token]
  );

  return authRequest;
};
