/**
 * Authentication Context
 *
 * Provides authentication state management throughout the application.
 * Handles user state, token management, persistence, and authentication flows.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type {
  User,
  AuthState,
  AuthContextType,
  AuthTokens,
} from '../types/auth';
import {
  getStoredUser,
  getAccessToken,
  setTokens,
  setUser,
  clearAuthData,
  isAuthenticated as checkIsAuthenticated,
} from '../api/auth';
import { queryKeys } from '../lib/queryKeys';

/**
 * Helper function to create AuthTokens object
 */
const createAuthTokens = (
  accessToken: string,
  refreshToken: string
): AuthTokens => ({
  accessToken,
  refreshToken,
  expiresIn: '24h', // Default value since we don't track this in localStorage
});

// Auth actions for reducer
type AuthAction =
  | { type: 'LOGIN_START' }
  | {
      type: 'LOGIN_SUCCESS';
      payload: { user: User; accessToken: string; refreshToken: string };
    }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | {
      type: 'REFRESH_TOKEN_SUCCESS';
      payload: { accessToken: string; refreshToken: string };
    }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED' };

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,
};

// Auth reducer to manage state transitions
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        error: null,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_INITIALIZED':
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
      };

    default:
      return state;
  }
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const queryClient = useQueryClient();

  /**
   * Initialize authentication state from localStorage
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getStoredUser();
        const isAuth = checkIsAuthenticated();

        if (storedUser && isAuth) {
          dispatch({ type: 'SET_USER', payload: storedUser });
        }
      } catch (error) {
        console.warn('Failed to initialize auth from storage:', error);
        // Clear potentially corrupted data
        clearAuthData();
      } finally {
        dispatch({ type: 'SET_INITIALIZED' });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function that updates state and stores tokens
   */
  const login = async (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => {
    try {
      // Store tokens and user data
      setTokens(createAuthTokens(accessToken, refreshToken));
      setUser(user);

      // Update auth state
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken },
      });

      // Clear any cached data from previous sessions
      queryClient.clear();
    } catch (error) {
      console.error('Login state update failed:', error);
      throw error;
    }
  };

  /**
   * Logout function that clears state and cache
   */
  const logout = async () => {
    try {
      // Clear stored data
      clearAuthData();

      // Update auth state
      dispatch({ type: 'LOGOUT' });

      // Clear all query cache
      queryClient.clear();

      // Invalidate all queries to prevent stale data
      await queryClient.invalidateQueries();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear state even if cleanup fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  /**
   * Update user profile in state
   */
  const updateUser = (user: User) => {
    try {
      setUser(user);
      dispatch({ type: 'SET_USER', payload: user });

      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  };

  /**
   * Update tokens after refresh
   */
  const updateTokens = (accessToken: string, refreshToken: string) => {
    try {
      setTokens(createAuthTokens(accessToken, refreshToken));
      dispatch({
        type: 'REFRESH_TOKEN_SUCCESS',
        payload: { accessToken, refreshToken },
      });
    } catch (error) {
      console.error('Token update failed:', error);
      throw error;
    }
  };

  /**
   * Clear authentication error
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  /**
   * Check if user has valid authentication
   */
  const isAuthenticated = checkIsAuthenticated() && state.isAuthenticated;

  /**
   * Get current access token
   */
  const getToken = () => getAccessToken();

  // Context value
  const contextValue: AuthContextType = {
    // State
    user: state.user,
    isAuthenticated,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    error: state.error,

    // Actions
    login,
    logout,
    updateUser,
    updateTokens,
    clearError,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to use the auth context
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};

/**
 * Hook to get authentication state
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, isInitialized, error, getToken } =
    useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    getToken,
  };
};

/**
 * Hook to get authentication actions
 */
export const useAuthActions = () => {
  const { login, logout, updateUser, updateTokens, clearError } =
    useAuthContext();

  return {
    login,
    logout,
    updateUser,
    updateTokens,
    clearError,
  };
};
