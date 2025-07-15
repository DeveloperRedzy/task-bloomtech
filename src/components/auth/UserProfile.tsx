/**
 * User Profile Component
 *
 * Displays user profile information and provides logout functionality.
 * Shows user data from the auth context and includes profile actions.
 */

import React from 'react';
import { Button } from '../ui/button';
import { useAuth, useLogout } from '../../hooks/auth';

interface UserProfileProps {
  className?: string;
  showLogout?: boolean;
}

/**
 * User profile display component with logout functionality
 */
export const UserProfile: React.FC<UserProfileProps> = ({
  className = '',
  showLogout = true,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-3 bg-gray-200 rounded w-1/2'></div>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <div className={`${className}`}>
        <p className='text-gray-500'>Not authenticated</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className='space-y-4'>
        {/* User Info */}
        <div className='space-y-2'>
          <div>
            <h3 className='text-lg font-semibold'>
              {user.firstName} {user.lastName}
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>{user.email}</p>
          </div>

          {/* Account Details */}
          <div className='text-sm text-gray-500 dark:text-gray-400 space-y-1'>
            <p>
              <span className='font-medium'>User ID:</span> {user.id}
            </p>
            <p>
              <span className='font-medium'>Member since:</span>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.updatedAt !== user.createdAt && (
              <p>
                <span className='font-medium'>Last updated:</span>{' '}
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Logout Button */}
        {showLogout && (
          <div className='pt-2 border-t'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className='w-full'
            >
              {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Compact user profile component for navigation/header use
 */
export const CompactUserProfile: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* User Avatar */}
      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium'>
        {user.firstName[0]}
        {user.lastName[0]}
      </div>

      {/* User Info */}
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium truncate'>
          {user.firstName} {user.lastName}
        </p>
        <p className='text-xs text-gray-500 truncate'>{user.email}</p>
      </div>

      {/* Logout Button */}
      <Button
        variant='ghost'
        size='sm'
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className='text-xs'
      >
        {logoutMutation.isPending ? '...' : 'Sign out'}
      </Button>
    </div>
  );
};
