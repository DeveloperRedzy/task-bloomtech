import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate duration in hours from start and end time strings
 * Used for computing hours field from time ranges
 */
export const calculateHoursFromTimeRange = (
  startTime: string,
  endTime: string
): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  let durationMinutes = endTotalMinutes - startTotalMinutes;

  // Handle overnight shifts (end time is next day)
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  return durationMinutes / 60; // Convert to hours
};

/**
 * Format time range for display
 * Converts 24-hour format to readable format
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Validate time format (HH:MM)
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Migrate old work entry to new time range format
 * For entries that only have hours, we'll assume a standard 9-to-5 workday
 */
export const migrateWorkEntryToTimeRange = (entry: any): any => {
  // If already has time ranges, return as is
  if (entry.startTime && entry.endTime) {
    return entry;
  }

  // If has hours but no time ranges, create default time range
  if (entry.hours && !entry.startTime && !entry.endTime) {
    // Default to 9 AM start time
    const startTime = '09:00';
    const endHours = 9 + entry.hours;

    // Calculate end time
    const endHour = Math.floor(endHours);
    const endMinutes = Math.round((endHours - endHour) * 60);
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinutes
      .toString()
      .padStart(2, '0')}`;

    return {
      ...entry,
      startTime,
      endTime,
    };
  }

  return entry;
};

/**
 * Check if a work entry is in the old format (has hours but no time ranges)
 */
export const isLegacyWorkEntry = (entry: any): boolean => {
  return entry.hours && (!entry.startTime || !entry.endTime);
};
