/**
 * Authentication API Service
 *
 * API functions for authentication-related operations.
 * Implements all endpoints from the BloomTeq Work Tracker API.
 */

import { apiClient } from './client';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  AuthTokens,
  RefreshTokenRequest,
} from '../types/auth';
import type { ApiResponse } from '../types/api';

// Base path for auth endpoints
const AUTH_BASE_PATH = '/api/auth';

/**
 * User Login
 * POST /api/auth/login
 *
 * @param credentials - Email and password
 * @returns Promise with user data and tokens
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    `${AUTH_BASE_PATH}/login`,
    credentials
  );

  if (!response.success) {
    throw new Error(response.message || 'Login failed');
  }

  return response.data;
};

/**
 * User Registration
 * POST /api/auth/register
 *
 * @param userData - Registration form data
 * @returns Promise with user data and tokens
 */
export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    `${AUTH_BASE_PATH}/register`,
    userData
  );

  if (!response.success) {
    throw new Error(response.message || 'Registration failed');
  }

  return response.data;
};

/**
 * Refresh Access Token
 * POST /api/auth/refresh
 *
 * @param refreshToken - Current refresh token
 * @returns Promise with new tokens
 */
export const refreshToken = async (
  refreshTokenData: RefreshTokenRequest
): Promise<AuthTokens> => {
  const response = await apiClient.post<ApiResponse<AuthTokens>>(
    `${AUTH_BASE_PATH}/refresh`,
    refreshTokenData
  );

  if (!response.success) {
    throw new Error(response.message || 'Token refresh failed');
  }

  return response.data;
};

/**
 * Get User Profile
 * GET /api/auth/profile
 *
 * Requires authentication token in headers
 * @returns Promise with user profile data
 */
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(
    `${AUTH_BASE_PATH}/profile`
  );

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch profile');
  }

  return response.data;
};

/**
 * Logout User
 * Clears local storage tokens and performs any necessary cleanup
 *
 * Note: The API doesn't have a logout endpoint, so this handles local cleanup
 */
export const logout = async (): Promise<void> => {
  try {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Optional: Call API logout endpoint if it exists in the future
    // await apiClient.post('/auth/logout')

    // Clear any other auth-related data
    localStorage.removeItem('user');

    return Promise.resolve();
  } catch (error) {
    // Don't throw on logout - always succeed locally
    console.warn('Logout cleanup warning:', error);
    return Promise.resolve();
  }
};

/**
 * Check if user is authenticated
 * Utility function to check if valid tokens exist
 *
 * @returns boolean indicating if user appears to be authenticated
 */
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  return !!(accessToken && refreshToken);
};

/**
 * Get stored access token
 * Utility function to retrieve the current access token
 *
 * @returns access token string or null
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Get stored refresh token
 * Utility function to retrieve the current refresh token
 *
 * @returns refresh token string or null
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

/**
 * Store authentication tokens
 * Utility function to store tokens in localStorage
 *
 * @param tokens - Access and refresh tokens
 */
export const setTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

/**
 * Store user data
 * Utility function to store user profile in localStorage
 *
 * @param user - User profile data
 */
export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get stored user data
 * Utility function to retrieve user profile from localStorage
 *
 * @returns User object or null
 */
export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.warn('Failed to parse stored user data:', error);
    return null;
  }
};

/**
 * Clear all auth data
 * Utility function to clear all authentication-related data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
