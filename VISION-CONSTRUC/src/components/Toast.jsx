import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now().toString();
    const newToast = { id, message, type, title, isExiting: false };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="toast-container">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`toast toast-${toast.type} ${toast.isExiting ? 'toast-exit' : ''}`}
                role="alert"
              >
                <div className="toast-icon">
                  {toast.type === 'success' && <FiCheckCircle size={20} />}
                  {toast.type === 'error' && <FiXCircle size={20} />}
                  {toast.type === 'warning' && <FiAlertTriangle size={20} />}
                  {toast.type === 'info' && <FiInfo size={20} />}
                </div>
                <div className="toast-content">
                  {toast.title && <div className="toast-title">{toast.title}</div>}
                  <div className="toast-message">{toast.message}</div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="toast-close"
                  aria-label="Close notification"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
