/**
 * Auth Guard Component
 *
 * Route protection component that redirects unauthenticated users to login.
 * Integrates with AuthContext for authentication state management.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component that protects routes and redirects to login if not authenticated
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading state while initializing auth
  if (isLoading || !isInitialized) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to='/auth/login' state={{ from: location.pathname }} replace />
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default AuthGuard;
