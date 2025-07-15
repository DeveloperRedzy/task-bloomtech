import type { ToastProps } from '../components/ui/toast';

// Toast utility functions that can be used with the useToast hook
export const createToastHelpers = (
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
) => {
  return {
    success: (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'success',
        duration: 4000,
      });
    },

    error: (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'error',
        duration: 6000,
      });
    },

    warning: (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'warning',
        duration: 5000,
      });
    },

    info: (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'info',
        duration: 4000,
      });
    },

    default: (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'default',
        duration: 4000,
      });
    },

    // Custom toast with all options
    custom: (options: Omit<ToastProps, 'id' | 'onClose'>) => {
      showToast(options);
    },
  };
};

// Common toast messages
export const TOAST_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Welcome back!',
    LOGIN_ERROR: 'Login failed',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Account created successfully',
    REGISTER_ERROR: 'Registration failed',
    PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
    PROFILE_UPDATE_ERROR: 'Failed to update profile',
  },
  WORK_ENTRIES: {
    CREATE_SUCCESS: 'Work entry created successfully',
    CREATE_ERROR: 'Failed to create work entry',
    UPDATE_SUCCESS: 'Work entry updated successfully',
    UPDATE_ERROR: 'Failed to update work entry',
    DELETE_SUCCESS: 'Work entry deleted successfully',
    DELETE_ERROR: 'Failed to delete work entry',
    LOAD_ERROR: 'Failed to load work entries',
  },
  NETWORK: {
    CONNECTION_ERROR: 'Network connection error',
    TIMEOUT_ERROR: 'Request timed out',
    UNAUTHORIZED: 'Session expired. Please log in again.',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_DATE: 'Please select a valid date',
    INVALID_HOURS: 'Hours must be in quarter-hour increments',
  },
} as const;

// Toast duration constants
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000,
} as const;
