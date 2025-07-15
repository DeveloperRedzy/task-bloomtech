import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div className='flex items-center justify-center'>
      <div className={cn('flex flex-col items-center space-y-2', className)}>
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-muted border-t-primary',
            sizeClasses[size]
          )}
        />
        {text && <p className='text-sm text-muted-foreground'>{text}</p>}
      </div>
    </div>
  );
};

// Page-level loading component
export interface PageLoadingProps {
  text?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  text = 'Loading...',
}) => {
  return (
    <div className='flex items-center justify-center min-h-[400px]'>
      <LoadingSpinner size='lg' text={text} />
    </div>
  );
};

// Inline loading component for buttons and small areas
export interface InlineLoadingProps {
  text?: string;
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text,
  className,
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size='sm' />
      {text && <span className='text-sm'>{text}</span>}
    </div>
  );
};

// Full screen loading overlay
export interface FullScreenLoadingProps {
  text?: string;
  isVisible: boolean;
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  text = 'Loading...',
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <LoadingSpinner size='xl' text={text} />
    </div>
  );
};

export default LoadingSpinner;
