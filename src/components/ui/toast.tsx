import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  id: _id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  action,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-hide toast after duration
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  const variantStyles = {
    default: 'bg-background border-border',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconMap = {
    default: '📢',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-200',
        variantStyles[variant],
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0',
        isLeaving && 'translate-x-full opacity-0'
      )}
    >
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0 text-lg'>{iconMap[variant]}</div>

        <div className='flex-1 min-w-0'>
          {title && <div className='text-sm font-medium mb-1'>{title}</div>}
          {description && (
            <div className='text-sm opacity-90'>{description}</div>
          )}
        </div>

        <div className='flex-shrink-0 flex items-center gap-2'>
          {action && (
            <Button
              variant='outline'
              size='sm'
              onClick={action.onClick}
              className='text-xs h-6 px-2'
            >
              {action.label}
            </Button>
          )}

          <button
            onClick={handleClose}
            className='text-sm opacity-70 hover:opacity-100 transition-opacity'
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
