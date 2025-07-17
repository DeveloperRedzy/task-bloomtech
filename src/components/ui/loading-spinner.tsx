import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'muted';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const variantClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-transparent border-t-current',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  spinnerSize?: LoadingSpinnerProps['size'];
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  spinnerSize = 'md',
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className='absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10'>
          <div className='flex flex-col items-center gap-3'>
            <LoadingSpinner size={spinnerSize} variant='primary' />
            <span className='text-sm text-muted-foreground'>{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  spinnerSize?: LoadingSpinnerProps['size'];
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  loadingText,
  disabled,
  className,
  spinnerSize = 'sm',
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading && <LoadingSpinner size={spinnerSize} />}
      {isLoading ? loadingText || 'Loading...' : children}
    </button>
  );
};

export interface PageLoadingProps {
  message?: string;
  size?: LoadingSpinnerProps['size'];
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading...',
  size = 'lg',
}) => {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <LoadingSpinner size={size} variant='primary' />
        <p className='text-muted-foreground'>{message}</p>
      </div>
    </div>
  );
};

export interface SectionLoadingProps {
  message?: string;
  size?: LoadingSpinnerProps['size'];
  minHeight?: string;
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({
  message = 'Loading...',
  size = 'md',
  minHeight = '200px',
}) => {
  return (
    <div
      className='flex items-center justify-center bg-background'
      style={{ minHeight }}
    >
      <div className='text-center space-y-3'>
        <LoadingSpinner size={size} variant='primary' />
        <p className='text-sm text-muted-foreground'>{message}</p>
      </div>
    </div>
  );
};

export interface InlineLoadingProps {
  message?: string;
  size?: LoadingSpinnerProps['size'];
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = 'Loading...',
  size = 'sm',
}) => {
  return (
    <div className='inline-flex items-center gap-2'>
      <LoadingSpinner size={size} variant='muted' />
      <span className='text-sm text-muted-foreground'>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
