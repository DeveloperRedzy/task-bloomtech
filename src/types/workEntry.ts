/**
 * Work Entry Types
 *
 * TypeScript interfaces for work entry-related data structures
 * based on the BloomTeq Work Tracker API documentation.
 * Updated to match actual API structure with ISO datetime timestamps.
 */

// Main work entry interface (matches API response)
export interface WorkEntry {
  id: string;
  startTime: string; // ISO datetime string (e.g., "2025-01-08T09:00:00.000Z")
  endTime: string; // ISO datetime string (e.g., "2025-01-08T17:00:00.000Z")
  duration: number; // Computed decimal number (hours as decimal)
  description: string; // 1-500 characters
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

// Data for creating a new work entry (matches API request)
export interface CreateWorkEntryData {
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  description: string; // Required, 1-500 characters
}

// Data for updating an existing work entry (all fields optional)
export interface UpdateWorkEntryData {
  startTime?: string; // ISO datetime string
  endTime?: string; // ISO datetime string
  description?: string;
}

// Query parameters for filtering work entries
export interface WorkEntryFilters {
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 20, max: 100)
  startDate?: string; // Filter entries from date (YYYY-MM-DD)
  endDate?: string; // Filter entries to date (YYYY-MM-DD)
  sortBy?: 'startTime' | 'duration' | 'createdAt'; // Sort field (default: 'startTime')
  sortOrder?: 'asc' | 'desc'; // Sort order (default: 'desc')
}

// Work entry statistics response
export interface WorkEntryStats {
  totalHours: number; // Total hours worked in the period
  averageHours: number; // Average hours per entry
  totalEntries: number; // Total number of entries
}

// Query parameters for statistics
export interface WorkStatsFilters {
  startDate?: string; // Start date for statistics (YYYY-MM-DD)
  endDate?: string; // End date for statistics (YYYY-MM-DD)
}

// Validation constraints (from API documentation)
export interface WorkEntryConstraints {
  datetime: {
    format: 'ISO string'; // ISO datetime format
    minDuration: 0.25; // Minimum 15 minutes
    maxDuration: 24; // Maximum 24 hours per entry
    maxAge: 365; // Cannot be older than 1 year
    allowFuture: false; // Cannot be future datetime
  };
  description: {
    minLength: 1;
    maxLength: 500;
  };
}

// Form state interfaces for UI components
export interface WorkEntryFormData extends CreateWorkEntryData {
  // Additional form-specific fields can be added here
}

export interface WorkEntryFormErrors {
  startTime?: string;
  endTime?: string;
  description?: string;
  general?: string;
}

// Table column definitions for UI
export type WorkEntryTableColumn =
  | 'datetime'
  | 'duration'
  | 'description'
  | 'actions';

// Sort configuration for table
export interface WorkEntrySortConfig {
  field: WorkEntryFilters['sortBy'];
  direction: WorkEntryFilters['sortOrder'];
}

// Utility types for time calculations
export interface DateTimeRange {
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  duration: number; // Hours as decimal
}

// Type for grouped entries by date (to support multiple entries per day)
export interface DailyWorkEntries {
  date: string; // YYYY-MM-DD format
  entries: WorkEntry[];
  totalHours: number;
}

// Form input data (for UI state management)
export interface WorkEntryFormInput {
  date: string; // YYYY-MM-DD format for date input
  startTime: string; // HH:MM format for time input
  endTime: string; // HH:MM format for time input
  description: string;
}
