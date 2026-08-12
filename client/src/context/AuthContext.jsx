import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../utils/api.js';

const AuthContext = createContext(null);

/**
 * AuthProvider keeps JWT tokens inside memory state (reducing XSS risk).
 * Operates a silent refresh call on startup to check for HTTP-Only session cookies.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const data = await apiRequest('/auth/refresh', { method: 'POST' });
        if (data && data.success) {
          setToken(data.accessToken);
          setUser(data.user);
        }
      } catch {
        // Silently discard refresh errors on initial load (means user is not logged in)
        console.warn('Initial session restore: no active cookie.');
      } finally {
        setLoading(false);
      }
    };
    silentRefresh();
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data && data.success) {
      setToken(data.accessToken);
      setUser(data.user);
      return data.user;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout endpoint error:', err.message);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
