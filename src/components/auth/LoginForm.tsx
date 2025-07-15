/**
 * Login Form Component
 *
 * React form component for user authentication with validation.
 * Uses React Hook Form with Zod validation and TanStack Query.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useLogin } from '../../hooks/auth';
import { loginSchema } from '../../lib/validations';
import type { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * Login form component with validation and error handling
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      clearErrors();
      await loginMutation.mutateAsync(data);

      // Handle successful login
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle login errors
      const errorMessage = error?.message || 'Login failed. Please try again.';

      if (errorMessage.includes('email')) {
        setError('email', { message: errorMessage });
      } else if (errorMessage.includes('password')) {
        setError('password', { message: errorMessage });
      } else {
        setError('root', { message: errorMessage });
      }
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold'>Welcome back</h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Enter your email and password to sign in
          </p>
        </div>

        {/* Email Field */}
        <div className='space-y-2'>
          <label
            htmlFor='email'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Email
          </label>
          <input
            {...register('email')}
            id='email'
            type='email'
            placeholder='Enter your email'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isSubmitting || loginMutation.isPending}
          />
          {errors.email && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <label
            htmlFor='password'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Password
          </label>
          <input
            {...register('password')}
            id='password'
            type='password'
            placeholder='Enter your password'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isSubmitting || loginMutation.isPending}
          />
          {errors.password && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Global Error */}
        {errors.root && (
          <div className='rounded-md bg-red-50 dark:bg-red-900/20 p-4'>
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.root.message}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full'
          disabled={isSubmitting || loginMutation.isPending}
        >
          {isSubmitting || loginMutation.isPending
            ? 'Signing in...'
            : 'Sign in'}
        </Button>

        {/* Register Link */}
        <div className='text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={() => navigate('/auth/register')}
              className='font-medium text-primary hover:underline'
              disabled={isSubmitting || loginMutation.isPending}
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
