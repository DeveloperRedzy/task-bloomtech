/**
 * API Services Export Index
 *
 * Central export point for all API services.
 * Provides easy imports for components and hooks.
 */

// Re-export the HTTP client
export { apiClient } from './client';

// Re-export authentication API
export * from './auth';

// Re-export work entries API
export * from './workEntries';

// Re-export types for convenience
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  AuthTokens,
  RefreshTokenRequest,
  AuthState,
  AuthContextType,
  PasswordRequirements,
} from '../types/auth';

export type {
  WorkEntry,
  CreateWorkEntryData,
  UpdateWorkEntryData,
  WorkEntryFilters,
  WorkEntryStats,
  WorkStatsFilters,
  WorkEntryFormData,
} from '../types/workEntry';

export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginationResponse,
  RequestContext,
} from '../types/api';
