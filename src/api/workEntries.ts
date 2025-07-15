/**
 * Work Entries API Service
 *
 * API functions for work entry-related operations.
 * Implements all endpoints from the BloomTech Work Tracker API.
 * Updated to work with ISO datetime format.
 */

import { apiClient } from './client';
import type {
  WorkEntry,
  CreateWorkEntryData,
  UpdateWorkEntryData,
  WorkEntryFilters,
  WorkEntryStats,
  WorkStatsFilters,
} from '../types/workEntry';
import type { ApiResponse, PaginationResponse } from '../types/api';

// Base path for work entries endpoints
const WORK_ENTRIES_BASE_PATH = '/api/work-entries';

/**
 * Response type for paginated work entries
 */
interface WorkEntriesResponse {
  data: WorkEntry[];
  pagination: PaginationResponse;
}

/**
 * Get Work Entries with Filtering and Pagination
 * GET /api/work-entries
 *
 * @param filters - Query parameters for filtering, sorting, and pagination
 * @returns Promise with paginated work entries
 */
export const getWorkEntries = async (
  filters: WorkEntryFilters = {}
): Promise<WorkEntriesResponse> => {
  // Build query parameters
  const searchParams = new URLSearchParams();

  // Add pagination parameters
  if (filters.page) searchParams.set('page', filters.page.toString());
  if (filters.limit) searchParams.set('limit', filters.limit.toString());

  // Add filtering parameters
  if (filters.startDate) searchParams.set('startDate', filters.startDate);
  if (filters.endDate) searchParams.set('endDate', filters.endDate);

  // Add sorting parameters
  if (filters.sortBy) searchParams.set('sortBy', filters.sortBy);
  if (filters.sortOrder) searchParams.set('sortOrder', filters.sortOrder);

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `${WORK_ENTRIES_BASE_PATH}?${queryString}`
    : WORK_ENTRIES_BASE_PATH;

  const response = await apiClient.get<
    ApiResponse<WorkEntry[]> & { pagination: PaginationResponse }
  >(endpoint);

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch work entries');
  }

  return {
    data: response.data,
    pagination: response.pagination,
  };
};

/**
 * Get Single Work Entry by ID
 * GET /api/work-entries/:id
 *
 * @param id - Work entry ID
 * @returns Promise with work entry data
 */
export const getWorkEntry = async (id: string | number): Promise<WorkEntry> => {
  const response = await apiClient.get<ApiResponse<WorkEntry>>(
    `${WORK_ENTRIES_BASE_PATH}/${id}`
  );

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch work entry');
  }

  return response.data;
};

/**
 * Create New Work Entry
 * POST /api/work-entries
 *
 * @param workEntryData - Work entry creation data
 * @returns Promise with created work entry
 */
export const createWorkEntry = async (
  workEntryData: CreateWorkEntryData
): Promise<WorkEntry> => {
  const response = await apiClient.post<ApiResponse<WorkEntry>>(
    WORK_ENTRIES_BASE_PATH,
    workEntryData
  );

  if (!response.success) {
    throw new Error(response.message || 'Failed to create work entry');
  }

  return response.data;
};

/**
 * Update Existing Work Entry
 * PUT /api/work-entries/:id
 *
 * @param id - Work entry ID
 * @param workEntryData - Work entry update data
 * @returns Promise with updated work entry
 */
export const updateWorkEntry = async (
  id: string | number,
  workEntryData: UpdateWorkEntryData
): Promise<WorkEntry> => {
  const response = await apiClient.put<ApiResponse<WorkEntry>>(
    `${WORK_ENTRIES_BASE_PATH}/${id}`,
    workEntryData
  );

  if (!response.success) {
    throw new Error(response.message || 'Failed to update work entry');
  }

  return response.data;
};

/**
 * Delete Work Entry
 * DELETE /api/work-entries/:id
 *
 * @param id - Work entry ID
 * @returns Promise that resolves when deletion is complete
 */
export const deleteWorkEntry = async (id: string | number): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `${WORK_ENTRIES_BASE_PATH}/${id}`
  );

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete work entry');
  }

  // Return void for successful deletion
  return;
};

/**
 * Get Work Entry Statistics
 * GET /api/work-entries/stats
 *
 * @param filters - Optional date range filters for statistics
 * @returns Promise with work statistics
 */
export const getWorkStats = async (
  filters: WorkStatsFilters = {}
): Promise<WorkEntryStats> => {
  // Build query parameters for date filtering
  const searchParams = new URLSearchParams();

  if (filters.startDate) searchParams.set('startDate', filters.startDate);
  if (filters.endDate) searchParams.set('endDate', filters.endDate);

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `${WORK_ENTRIES_BASE_PATH}/stats?${queryString}`
    : `${WORK_ENTRIES_BASE_PATH}/stats`;

  const response = await apiClient.get<ApiResponse<WorkEntryStats>>(endpoint);

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch work statistics');
  }

  return response.data;
};

/**
 * Utility function to build work entry filters
 * Helps create properly formatted filter objects
 *
 * @param options - Filter options
 * @returns Formatted WorkEntryFilters object
 */
export const buildWorkEntryFilters = (options: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: 'startTime' | 'duration' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}): WorkEntryFilters => {
  return {
    page: options.page || 1,
    limit: options.limit || 20,
    startDate: options.startDate,
    endDate: options.endDate,
    sortBy: options.sortBy || 'startTime',
    sortOrder: options.sortOrder || 'desc',
  };
};

/**
 * Utility function to validate work entry data before submission
 * Performs client-side validation before API calls
 *
 * @param data - Work entry data to validate
 * @returns Boolean indicating if data is valid
 */
export const validateWorkEntryData = (
  data: CreateWorkEntryData | UpdateWorkEntryData
): boolean => {
  // Basic validation - more comprehensive validation is handled by Zod schemas
  if ('startTime' in data && data.startTime) {
    try {
      const startDate = new Date(data.startTime);
      if (isNaN(startDate.getTime())) return false;
    } catch {
      return false;
    }
  }

  if ('endTime' in data && data.endTime) {
    try {
      const endDate = new Date(data.endTime);
      if (isNaN(endDate.getTime())) return false;
    } catch {
      return false;
    }
  }

  // If both start and end times are provided, validate duration
  if (
    'startTime' in data &&
    'endTime' in data &&
    data.startTime &&
    data.endTime
  ) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 0.25 || durationHours > 24) return false;
  }

  if ('description' in data && data.description) {
    if (data.description.length < 1 || data.description.length > 500)
      return false;
  }

  return true;
};

/**
 * Utility function to calculate duration from ISO datetime strings
 * Calculates hours between start and end time
 *
 * @param startTime - Start time in ISO format
 * @param endTime - End time in ISO format
 * @returns Duration in hours as decimal number
 */
export const calculateDurationFromISO = (
  startTime: string,
  endTime: string
): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

/**
 * Utility function to format datetime for display
 * Converts ISO datetime to readable format
 *
 * @param isoDateTime - ISO datetime string
 * @returns Formatted datetime string
 */
export const formatDateTime = (isoDateTime: string): string => {
  return new Date(isoDateTime).toLocaleString();
};

/**
 * Utility function to format time range for display
 * Converts ISO datetime strings to readable time range
 *
 * @param startTime - Start time in ISO format
 * @param endTime - End time in ISO format
 * @returns Formatted time range string
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Utility function to format duration for display
 * Converts decimal hours to human-readable format
 *
 * @param hours - Decimal hours value
 * @returns Formatted string representation
 */
export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
};

/**
 * Utility function to calculate total hours from work entries
 * Sums up duration from an array of work entries
 *
 * @param entries - Array of work entries
 * @returns Total hours as decimal number
 */
export const calculateTotalHours = (entries: WorkEntry[]): number => {
  return entries.reduce((total, entry) => total + entry.duration, 0);
};

/**
 * Utility function to group work entries by date
 * Groups entries for calendar or timeline views
 *
 * @param entries - Array of work entries
 * @returns Object with dates as keys and entries as values
 */
export const groupEntriesByDate = (
  entries: WorkEntry[]
): Record<string, WorkEntry[]> => {
  return entries.reduce((groups, entry) => {
    const date = entry.startTime.split('T')[0]; // Extract YYYY-MM-DD from ISO string
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, WorkEntry[]>);
};
