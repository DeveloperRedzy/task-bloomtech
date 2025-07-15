import React from 'react';
import { cn } from '../../lib/utils';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  label?: string;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  min,
  max,
  label,
  error,
}) => {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}
      <input
        type='date'
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
      />
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
};

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
  disabled = false,
  label,
  error,
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}
      <div className='flex gap-2 items-center'>
        <DatePicker
          value={startDate}
          onChange={onStartDateChange}
          placeholder='Start date'
          disabled={disabled}
          max={endDate || today}
          className='flex-1'
        />
        <span className='text-sm text-muted-foreground'>to</span>
        <DatePicker
          value={endDate}
          onChange={onEndDateChange}
          placeholder='End date'
          disabled={disabled}
          min={startDate}
          max={today}
          className='flex-1'
        />
      </div>
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
};

export default DatePicker;
