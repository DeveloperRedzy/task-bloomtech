import type { User } from '../../types/auth';
import type { WorkEntry } from '../../types/workEntry';

export const mockUser: User = {
  id: 'user-1',
  email: 'test@bloomteq.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockWorkEntry: WorkEntry = {
  id: 'entry-1',
  description: 'Development work on authentication system',
  startTime: '2025-01-15T09:00:00Z',
  endTime: '2025-01-15T17:00:00Z',
  duration: 8,
  createdAt: '2025-01-15T09:00:00Z',
  updatedAt: '2025-01-15T09:00:00Z',
};

export const mockWorkEntries: WorkEntry[] = [
  mockWorkEntry,
  {
    id: 'entry-2',
    description: 'Testing implementation and bug fixes',
    startTime: '2025-01-14T10:00:00Z',
    endTime: '2025-01-14T15:30:00Z',
    duration: 5.5,
    createdAt: '2025-01-14T10:00:00Z',
    updatedAt: '2025-01-14T10:00:00Z',
  },
  {
    id: 'entry-3',
    description: 'UI/UX improvements and design updates',
    startTime: '2025-01-13T08:30:00Z',
    endTime: '2025-01-13T16:30:00Z',
    duration: 8,
    createdAt: '2025-01-13T08:30:00Z',
    updatedAt: '2025-01-13T08:30:00Z',
  },
  {
    id: 'entry-4',
    description: 'Code review and documentation',
    startTime: '2025-01-12T09:15:00Z',
    endTime: '2025-01-12T12:15:00Z',
    duration: 3,
    createdAt: '2025-01-12T09:15:00Z',
    updatedAt: '2025-01-12T09:15:00Z',
  },
  {
    id: 'entry-5',
    description: 'Database optimization and performance tuning',
    startTime: '2025-01-11T14:00:00Z',
    endTime: '2025-01-11T18:45:00Z',
    duration: 4.75,
    createdAt: '2025-01-11T14:00:00Z',
    updatedAt: '2025-01-11T14:00:00Z',
  },
];

export const mockWorkStats = {
  totalHours: 29.25,
  totalEntries: 5,
  averageHours: 5.85,
  thisWeekHours: 13.5,
  lastWeekHours: 15.75,
  longestStreak: 5,
  mostProductiveDay: 'Monday',
  weeklyTrend: [
    { day: 'Mon', hours: 8 },
    { day: 'Tue', hours: 5.5 },
    { day: 'Wed', hours: 8 },
    { day: 'Thu', hours: 3 },
    { day: 'Fri', hours: 4.75 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
  ],
};

// Additional mock data for different test scenarios
export const mockEmptyWorkEntries: WorkEntry[] = [];

export const mockErrorResponse = {
  message: 'Internal server error',
  statusCode: 500,
};

export const mockValidationErrorResponse = {
  message: 'Validation failed',
  statusCode: 400,
  errors: [
    {
      field: 'description',
      message: 'Description is required',
    },
  ],
};

export const mockUnauthorizedResponse = {
  message: 'Unauthorized',
  statusCode: 401,
};

// Helper functions for creating mock data variations
export const createMockWorkEntry = (
  overrides: Partial<WorkEntry> = {}
): WorkEntry => ({
  ...mockWorkEntry,
  ...overrides,
  id: overrides.id || `entry-${Math.random().toString(36).substr(2, 9)}`,
});

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  ...mockUser,
  ...overrides,
  id: overrides.id || `user-${Math.random().toString(36).substr(2, 9)}`,
});

// Mock data for different user scenarios
export const mockAdminUser: User = {
  ...mockUser,
  id: 'admin-1',
  email: 'admin@bloomteq.com',
  firstName: 'Admin',
  lastName: 'User',
};

export const mockNewUser: User = {
  ...mockUser,
  id: 'new-user-1',
  email: 'newuser@bloomteq.com',
  firstName: 'New',
  lastName: 'User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
