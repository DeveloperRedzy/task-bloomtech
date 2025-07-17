import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  getTodayString,
  formatDateForInput,
  calculateHoursFromTimeRange,
  formatTimeRange,
  isValidTimeFormat,
  migrateWorkEntryToTimeRange,
  isLegacyWorkEntry,
} from '../utils';

describe('Utils', () => {
  describe('cn (className merge utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'not-applied')).toBe(
        'base conditional'
      );
    });

    it('should handle Tailwind conflicts with twMerge', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2'); // twMerge should keep the last padding
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
      expect(cn(null, undefined)).toBe('');
    });
  });

  describe('getTodayString', () => {
    beforeEach(() => {
      // Mock Date to return a specific date for consistent testing
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-15T10:30:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return today's date in YYYY-MM-DD format", () => {
      const result = getTodayString();
      expect(result).toBe('2024-03-15');
    });

    it('should pad single digit months and days with zeros', () => {
      vi.setSystemTime(new Date('2024-01-05T10:30:00Z'));
      const result = getTodayString();
      expect(result).toBe('2024-01-05');
    });
  });

  describe('formatDateForInput', () => {
    it('should format ISO date string for input', () => {
      const result = formatDateForInput('2024-03-15T10:30:00Z');
      expect(result).toBe('2024-03-15');
    });

    it('should handle date strings without time', () => {
      const result = formatDateForInput('2024-12-25');
      expect(result).toBe('2024-12-25');
    });

    it('should pad single digit months and days', () => {
      const result = formatDateForInput('2024-01-05T10:30:00Z');
      expect(result).toBe('2024-01-05');
    });
  });

  describe('calculateHoursFromTimeRange', () => {
    it('should calculate hours for normal work day', () => {
      const result = calculateHoursFromTimeRange('09:00', '17:30');
      expect(result).toBe(8.5);
    });

    it('should calculate hours for short duration', () => {
      const result = calculateHoursFromTimeRange('14:15', '15:45');
      expect(result).toBe(1.5);
    });

    it('should handle overnight shifts correctly', () => {
      const result = calculateHoursFromTimeRange('23:00', '07:00');
      expect(result).toBe(8);
    });

    it('should handle exact hour boundaries', () => {
      const result = calculateHoursFromTimeRange('09:00', '17:00');
      expect(result).toBe(8);
    });

    it('should handle 15-minute increments', () => {
      const result = calculateHoursFromTimeRange('09:15', '10:30');
      expect(result).toBe(1.25);
    });

    it('should handle same start and end time (0 hours)', () => {
      const result = calculateHoursFromTimeRange('09:00', '09:00');
      expect(result).toBe(0);
    });
  });

  describe('formatTimeRange', () => {
    it('should format AM times correctly', () => {
      const result = formatTimeRange('09:00', '11:30');
      expect(result).toBe('9:00 AM - 11:30 AM');
    });

    it('should format PM times correctly', () => {
      const result = formatTimeRange('14:00', '17:30');
      expect(result).toBe('2:00 PM - 5:30 PM');
    });

    it('should format midnight correctly', () => {
      const result = formatTimeRange('00:00', '01:00');
      expect(result).toBe('12:00 AM - 1:00 AM');
    });

    it('should format noon correctly', () => {
      const result = formatTimeRange('12:00', '13:00');
      expect(result).toBe('12:00 PM - 1:00 PM');
    });

    it('should handle AM to PM transition', () => {
      const result = formatTimeRange('11:30', '13:15');
      expect(result).toBe('11:30 AM - 1:15 PM');
    });

    it('should handle overnight shift display', () => {
      const result = formatTimeRange('23:00', '07:00');
      expect(result).toBe('11:00 PM - 7:00 AM');
    });
  });

  describe('isValidTimeFormat', () => {
    it('should validate correct time formats', () => {
      expect(isValidTimeFormat('09:00')).toBe(true);
      expect(isValidTimeFormat('23:59')).toBe(true);
      expect(isValidTimeFormat('00:00')).toBe(true);
      expect(isValidTimeFormat('12:30')).toBe(true);
    });

    it('should reject invalid time formats', () => {
      expect(isValidTimeFormat('24:00')).toBe(false);
      expect(isValidTimeFormat('12:60')).toBe(false);
      expect(isValidTimeFormat('9:00')).toBe(true); // Single digit hour is valid
      expect(isValidTimeFormat('09:0')).toBe(false); // Missing trailing zero
      expect(isValidTimeFormat('abc:def')).toBe(false);
      expect(isValidTimeFormat('12:30:00')).toBe(false); // Includes seconds
      expect(isValidTimeFormat('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidTimeFormat('1:00')).toBe(true); // Single digit hour is valid
      expect(isValidTimeFormat('9:00')).toBe(true); // Single digit hour is valid
      expect(isValidTimeFormat('01:5')).toBe(false); // Single digit minute is invalid
      expect(isValidTimeFormat('25:00')).toBe(false); // Invalid hour
      expect(isValidTimeFormat('12:')).toBe(false); // Missing minutes
      expect(isValidTimeFormat(':30')).toBe(false); // Missing hour
    });
  });

  describe('migrateWorkEntryToTimeRange', () => {
    it('should return entry unchanged if it already has time ranges', () => {
      const entry = {
        id: 1,
        startTime: '09:00',
        endTime: '17:00',
        hours: 8,
        description: 'Work',
      };
      const result = migrateWorkEntryToTimeRange(entry);
      expect(result).toEqual(entry);
    });

    it('should create time range from hours when missing time ranges', () => {
      const entry = {
        id: 1,
        hours: 8,
        description: 'Work',
      };
      const result = migrateWorkEntryToTimeRange(entry);
      expect(result).toEqual({
        id: 1,
        hours: 8,
        description: 'Work',
        startTime: '09:00',
        endTime: '17:00',
      });
    });

    it('should handle fractional hours correctly', () => {
      const entry = {
        id: 1,
        hours: 8.5,
        description: 'Work',
      };
      const result = migrateWorkEntryToTimeRange(entry);
      expect(result).toEqual({
        id: 1,
        hours: 8.5,
        description: 'Work',
        startTime: '09:00',
        endTime: '17:30',
      });
    });

    it('should handle quarter hour increments', () => {
      const entry = {
        id: 1,
        hours: 1.25,
        description: 'Short task',
      };
      const result = migrateWorkEntryToTimeRange(entry);
      expect(result).toEqual({
        id: 1,
        hours: 1.25,
        description: 'Short task',
        startTime: '09:00',
        endTime: '10:15',
      });
    });

    it('should return entry unchanged if no hours and no time ranges', () => {
      const entry = {
        id: 1,
        description: 'Work',
      };
      const result = migrateWorkEntryToTimeRange(entry);
      expect(result).toEqual(entry);
    });

    it('should handle partial time range data', () => {
      const entry = {
        id: 1,
        hours: 4,
        startTime: '09:00',
        description: 'Work',
      };
      const result = migrateWorkEntryToTimeRange(entry);
      expect(result).toEqual(entry); // Should return unchanged since startTime exists
    });
  });

  describe('isLegacyWorkEntry', () => {
    it('should identify legacy entries with hours but no time ranges', () => {
      const entry = {
        id: 1,
        hours: 8,
        description: 'Work',
      };
      expect(isLegacyWorkEntry(entry)).toBe(true);
    });

    it('should not identify modern entries as legacy', () => {
      const entry = {
        id: 1,
        startTime: '09:00',
        endTime: '17:00',
        description: 'Work',
      };
      expect(isLegacyWorkEntry(entry)).toBeFalsy();
    });

    it('should not identify entries without hours as legacy', () => {
      const entry = {
        id: 1,
        description: 'Work',
      };
      expect(isLegacyWorkEntry(entry)).toBeFalsy();
    });

    it('should handle partial migration state correctly', () => {
      const entryWithStart = {
        id: 1,
        hours: 8,
        startTime: '09:00',
        description: 'Work',
      };
      expect(isLegacyWorkEntry(entryWithStart)).toBe(true);

      const entryWithEnd = {
        id: 1,
        hours: 8,
        endTime: '17:00',
        description: 'Work',
      };
      expect(isLegacyWorkEntry(entryWithEnd)).toBe(true);
    });

    it('should handle entries with both hours and complete time ranges', () => {
      const entry = {
        id: 1,
        hours: 8,
        startTime: '09:00',
        endTime: '17:00',
        description: 'Work',
      };
      expect(isLegacyWorkEntry(entry)).toBe(false);
    });
  });
});
