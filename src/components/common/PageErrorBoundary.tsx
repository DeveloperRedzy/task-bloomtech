import React from 'react';
import { Button } from '../ui';
import ErrorBoundary from './ErrorBoundary';
import type { ErrorInfo } from 'react';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

const PageErrorFallback = () => (
  <div className='min-h-screen bg-background flex items-center justify-center p-4'>
    <div className='text-center max-w-md mx-auto'>
      <div className='mb-8'>
        <div className='text-6xl mb-4'>⚠️</div>
        <h1 className='text-2xl font-bold text-foreground mb-2'>
          Oops! Something went wrong
        </h1>
        <p className='text-muted-foreground mb-6'>
          We're sorry, but something unexpected happened. Please try refreshing
          the page or contact support if the problem persists.
        </p>
      </div>

      <div className='space-y-3'>
        <Button onClick={() => window.location.reload()} className='w-full'>
          Refresh Page
        </Button>
        <Button
          onClick={() => (window.location.href = '/dashboard')}
          variant='outline'
          className='w-full'
        >
          Go to Dashboard
        </Button>
      </div>

      <div className='mt-8 text-sm text-muted-foreground'>
        <p>Error ID: {Date.now()}</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({
  children,
  onError,
}) => {
  return (
    <ErrorBoundary
      fallback={<PageErrorFallback />}
      onError={onError}
      title='Page Error'
      description='A critical error occurred while loading this page.'
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
