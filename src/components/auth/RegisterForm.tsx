/**
 * Register Form Component
 *
 * React form component for user registration with validation.
 * Uses React Hook Form with Zod validation and TanStack Query.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useRegister } from '../../hooks/auth';
import { registerSchema } from '../../lib/validations';
import type { RegisterData } from '../../types/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * Registration form component with validation and error handling
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      clearErrors();
      await registerMutation.mutateAsync(data);

      // Handle successful registration
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle registration errors
      const errorMessage =
        error?.message || 'Registration failed. Please try again.';

      if (errorMessage.includes('email')) {
        setError('email', { message: errorMessage });
      } else if (errorMessage.includes('password')) {
        setError('password', { message: errorMessage });
      } else if (errorMessage.includes('firstName')) {
        setError('firstName', { message: errorMessage });
      } else if (errorMessage.includes('lastName')) {
        setError('lastName', { message: errorMessage });
      } else {
        setError('root', { message: errorMessage });
      }
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold'>Create account</h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Enter your information to create an account
          </p>
        </div>

        {/* First Name Field */}
        <div className='space-y-2'>
          <label
            htmlFor='firstName'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            First Name
          </label>
          <input
            {...register('firstName')}
            id='firstName'
            type='text'
            placeholder='Enter your first name'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isSubmitting || registerMutation.isPending}
          />
          {errors.firstName && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name Field */}
        <div className='space-y-2'>
          <label
            htmlFor='lastName'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Last Name
          </label>
          <input
            {...register('lastName')}
            id='lastName'
            type='text'
            placeholder='Enter your last name'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isSubmitting || registerMutation.isPending}
          />
          {errors.lastName && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.lastName.message}
            </p>
          )}
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
            disabled={isSubmitting || registerMutation.isPending}
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
            placeholder='Create a password'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isSubmitting || registerMutation.isPending}
          />
          {errors.password && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.password.message}
            </p>
          )}
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            Password must be at least 8 characters with uppercase, lowercase,
            number, and special character.
          </div>
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
          disabled={isSubmitting || registerMutation.isPending}
        >
          {isSubmitting || registerMutation.isPending
            ? 'Creating account...'
            : 'Create account'}
        </Button>

        {/* Login Link */}
        <div className='text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <button
              type='button'
              onClick={() => navigate('/auth/login')}
              className='font-medium text-primary hover:underline'
              disabled={isSubmitting || registerMutation.isPending}
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
