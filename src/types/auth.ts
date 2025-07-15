/**
 * Authentication Types
 *
 * TypeScript interfaces for all authentication-related data structures
 * based on the BloomTech Work Tracker API documentation.
 */

// User profile interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

// Login credentials for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data for new user creation
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// JWT token information
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string; // e.g., "24h"
}

// Complete authentication response from login/register
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Auth context state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Auth context actions
export interface AuthContextType extends AuthState {
  login: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
  getToken: () => string | null;
}

// Password requirements (from API docs)
export interface PasswordRequirements {
  minLength: 8;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}
