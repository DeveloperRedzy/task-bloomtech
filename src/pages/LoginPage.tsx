/**
 * Login Page
 *
 * Complete login page with authentication form and navigation.
 * Redirects authenticated users to dashboard.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth';
import { useAuth } from '../hooks/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Don't render if redirecting
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-md w-full space-y-8 px-4'>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
