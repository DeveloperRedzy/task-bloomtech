/**
 * Validation Schemas
 *
 * Zod validation schemas for forms and API data validation
 * based on the BloomTech Work Tracker API requirements.
 * Updated to work with ISO datetime strings.
 */

import { z } from 'zod';

// Email validation schema
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters');

// Password validation schema (based on API requirements)
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  )
  .max(128, 'Password must be less than 128 characters');

// Name validation schema
const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

// Date and time validation helpers
const today = new Date();
const oneYearAgo = new Date(
  today.getFullYear() - 1,
  today.getMonth(),
  today.getDate()
);

// ISO datetime validation schema
const isoDateTimeSchema = z
  .string()
  .min(1, 'Date and time are required')
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
    'Invalid datetime format. Expected ISO string format.'
  )
  .refine((dateTimeStr) => {
    try {
      const dateTime = new Date(dateTimeStr);
      return !isNaN(dateTime.getTime());
    } catch {
      return false;
    }
  }, 'Invalid datetime value')
  .refine((dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    return dateTime <= today;
  }, 'Date and time cannot be in the future')
  .refine((dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    return dateTime >= oneYearAgo;
  }, 'Date and time cannot be older than 1 year');

// Helper function to calculate duration in hours from ISO datetime strings
const calculateDurationFromISO = (
  startTime: string,
  endTime: string
): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

// Description validation schema
const descriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .max(500, 'Description must be less than 500 characters')
  .trim();

// Authentication Schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // Don't validate full password rules on login
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
});

// Work Entry Schemas (API format)
export const createWorkEntrySchema = z
  .object({
    startTime: isoDateTimeSchema,
    endTime: isoDateTimeSchema,
    description: descriptionSchema,
  })
  .refine((data) => {
    // Ensure end time is after start time
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }, 'End time must be after start time')
  .refine((data) => {
    // Ensure duration is at least 15 minutes
    const duration = calculateDurationFromISO(data.startTime, data.endTime);
    return duration >= 0.25;
  }, 'Duration must be at least 15 minutes')
  .refine((data) => {
    // Ensure duration is not more than 24 hours
    const duration = calculateDurationFromISO(data.startTime, data.endTime);
    return duration <= 24;
  }, 'Duration cannot exceed 24 hours');

export const updateWorkEntrySchema = z
  .object({
    startTime: isoDateTimeSchema.optional(),
    endTime: isoDateTimeSchema.optional(),
    description: descriptionSchema.optional(),
  })
  .refine((data) => {
    // At least one field must be provided for update
    return (
      data.startTime !== undefined ||
      data.endTime !== undefined ||
      data.description !== undefined
    );
  }, 'At least one field must be provided for update')
  .refine((data) => {
    // If both start and end times are provided, validate duration
    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return duration >= 0.25 && duration <= 24 && end > start;
    }
    return true;
  }, 'If both times are provided, end time must be after start time and duration must be between 15 minutes and 24 hours');

// Form input validation schema (for UI forms before converting to API format)
export const workEntryFormInputSchema = z
  .object({
    date: z
      .string()
      .min(1, 'Date is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: z
      .string()
      .min(1, 'Start time is required')
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Start time must be in HH:MM format'
      ),
    endTime: z
      .string()
      .min(1, 'End time is required')
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'End time must be in HH:MM format'
      ),
    description: descriptionSchema,
  })
  .refine((data) => {
    // Ensure end time is after start time on the same day
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    return endTotalMinutes > startTotalMinutes;
  }, 'End time must be after start time')
  .refine((data) => {
    // Ensure duration is at least 15 minutes
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    return durationMinutes >= 15;
  }, 'Duration must be at least 15 minutes');

// Date range validation schema
export const dateRangeSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .optional(),
  })
  .refine((data) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    }
    return true;
  }, 'End date must be after or equal to start date');

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const workEntryFiltersSchema = paginationSchema
  .extend({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .optional(),
    sortBy: z.enum(['startTime', 'duration', 'createdAt']).default('startTime'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine((data) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    }
    return true;
  }, 'End date must be after or equal to start date');

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateWorkEntryFormData = z.infer<typeof createWorkEntrySchema>;
export type UpdateWorkEntryFormData = z.infer<typeof updateWorkEntrySchema>;
export type WorkEntryFormInputData = z.infer<typeof workEntryFormInputSchema>;
export type DateRangeFormData = z.infer<typeof dateRangeSchema>;
export type WorkEntryFiltersData = z.infer<typeof workEntryFiltersSchema>;

// Utility functions
export const parseHours = (hoursStr: string): number => {
  const hours = parseFloat(hoursStr);
  if (isNaN(hours) || hours < 0) {
    throw new Error('Invalid hours format');
  }
  return hours;
};

// Utility function to validate date string
export const isValidDateString = (dateStr: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;

  const date = new Date(dateStr + 'T00:00:00.000Z');
  return !isNaN(date.getTime());
};

// Quick validation functions for common use cases
export const validateEmail = (email: string) => emailSchema.safeParse(email);
export const validatePassword = (password: string) =>
  passwordSchema.safeParse(password);
export const validateWorkEntryDate = (date: string) =>
  dateRangeSchema.safeParse({ startDate: date });
export const validateDateTime = (dateTime: string) =>
  isoDateTimeSchema.safeParse(dateTime);

// Convert form input to API format
export const convertFormInputToAPIFormat = (
  input: WorkEntryFormInputData
): { startTime: string; endTime: string; description: string } => {
  // Create Date objects in local timezone, not UTC
  const startDateTime = new Date(`${input.date}T${input.startTime}:00`);
  const endDateTime = new Date(`${input.date}T${input.endTime}:00`);

  return {
    startTime: startDateTime.toISOString(),
    endTime: endDateTime.toISOString(),
    description: input.description,
  };
};

// Calculate duration from form input
export const calculateDurationFromFormInput = (
  input: WorkEntryFormInputData
): number => {
  const [startHours, startMinutes] = input.startTime.split(':').map(Number);
  const [endHours, endMinutes] = input.endTime.split(':').map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  return durationMinutes / 60; // Convert to hours
};

// Export the duration calculation function for use in other files
export { calculateDurationFromISO };
