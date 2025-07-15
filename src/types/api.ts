/**
 * Common API Types
 *
 * Shared TypeScript interfaces for API responses, errors, and pagination
 * based on the BloomTech Work Tracker API documentation.
 */

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationResponse; // Only present in paginated responses
}

// API error response structure
export interface ApiError {
  success: false;
  message: string;
  error?: string; // Error code
  code?: string; // Alternative error code field
  details?: string[]; // Detailed error messages
  status: number; // HTTP status code
}

// Pagination query parameters
export interface PaginationParams {
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 20, max: 100)
}

// Pagination metadata in API responses
export interface PaginationResponse {
  page: number; // Current page number
  limit: number; // Items per page
  total: number; // Total number of items
  totalPages: number; // Total number of pages
  hasNext: boolean; // Whether there's a next page
  hasPrev: boolean; // Whether there's a previous page
}

// Base query parameters that can be extended by specific endpoints
export interface BaseQueryParams extends PaginationParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

// Validation error structure (from API docs)
export interface ValidationError {
  code: string; // Error code (e.g., "invalid_type")
  expected: string; // Expected type/format
  received: string; // Received type/format
  path: string[]; // Field path
  message: string; // Human-readable error message
}

// Enhanced API error with validation details
export interface ApiValidationError extends Omit<ApiError, 'details'> {
  errors: ValidationError[];
}

// Success response helper type
export type ApiSuccessResponse<T> = ApiResponse<T> & { success: true };

// Error response helper type
export type ApiErrorResponse = ApiError | ApiValidationError;

// Complete API response type (success or error)
export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Request status for loading states
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

// Common HTTP status codes
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

// Rate limiting information (from response headers)
export interface RateLimitInfo {
  limit: number; // Total requests allowed
  remaining: number; // Requests remaining
  reset: number; // Timestamp when limit resets
}

// Extended request context with metadata
export interface RequestContext {
  url: string;
  method: HttpMethod;
  timestamp: number;
  requestId?: string;
  userId?: string;
}

// Type guard helpers
export const isApiError = (response: any): response is ApiError => {
  return response && response.success === false && 'status' in response;
};

export const isValidationError = (
  response: any
): response is ApiValidationError => {
  return (
    isApiError(response) &&
    'errors' in response &&
    Array.isArray(response.errors)
  );
};

export const isSuccessResponse = <T>(
  response: any
): response is ApiSuccessResponse<T> => {
  return response && response.success === true && 'data' in response;
};
