import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  title?: string;
  description?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className='max-w-2xl mx-auto mt-8'>
          <CardHeader>
            <CardTitle className='text-destructive'>
              {this.props.title || 'Something went wrong'}
            </CardTitle>
            <CardDescription>
              {this.props.description ||
                'An unexpected error occurred. Please try again or contact support if the problem persists.'}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex gap-2'>
              <Button onClick={this.handleReset} variant='outline'>
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant='outline'
              >
                Reload Page
              </Button>
            </div>

            {/* Show error details in development */}
            {(this.props.showErrorDetails ||
              process.env.NODE_ENV === 'development') &&
              this.state.error && (
                <details className='mt-4'>
                  <summary className='cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground'>
                    Error Details (for developers)
                  </summary>
                  <div className='mt-2 p-3 bg-muted rounded-md'>
                    <div className='text-sm font-mono'>
                      <div className='font-semibold text-destructive mb-2'>
                        {this.state.error.name}: {this.state.error.message}
                      </div>
                      <pre className='whitespace-pre-wrap text-xs text-muted-foreground'>
                        {this.state.error.stack}
                      </pre>
                      {this.state.errorInfo && (
                        <div className='mt-2 pt-2 border-t'>
                          <div className='font-semibold mb-1'>
                            Component Stack:
                          </div>
                          <pre className='whitespace-pre-wrap text-xs text-muted-foreground'>
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
