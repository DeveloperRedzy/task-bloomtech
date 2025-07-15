import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './toast';
import type { ToastProps } from './toast';

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

interface ToastState extends ToastProps {
  id: string;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback(
    (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);

      const newToast: ToastState = {
        ...toast,
        id,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Keep only the most recent toasts
        return updated.slice(-maxToasts);
      });
    },
    [maxToasts]
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <div className='fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none'>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
