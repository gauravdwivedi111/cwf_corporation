import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

/**
 * ToastProvider provides a lightweight notification system with zero dependencies.
 * Animate state lists dynamically, fading alerts out after a configurable timeout.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <div className="toast-container" id="global-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close message">
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
