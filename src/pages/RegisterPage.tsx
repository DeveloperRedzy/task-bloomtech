/**
 * Register Page
 *
 * Complete registration page with signup form and navigation.
 * Redirects authenticated users to dashboard.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth';
import { useAuth } from '../hooks/auth';

const RegisterPage: React.FC = () => {
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
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
