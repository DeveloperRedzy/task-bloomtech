import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateWorkEntry } from '../../hooks/workEntries';
import {
  workEntryFormInputSchema,
  convertFormInputToAPIFormat,
} from '../../lib/validations';
import {
  Form,
  FormField,
  FormMessage,
  Button,
  Input,
  Label,
  DatePicker,
} from '../ui';
import { getTodayString } from '../../lib/utils';
import type { WorkEntry, WorkEntryFormInput } from '../../types/workEntry';

export interface EditWorkEntryFormProps {
  workEntry: WorkEntry;
  onSuccess?: (workEntry: WorkEntry) => void;
  onCancel?: () => void;
  className?: string;
}

// Helper function to convert API format to form input format
const convertAPIToFormInput = (workEntry: WorkEntry): WorkEntryFormInput => {
  const startDateTime = new Date(workEntry.startTime);
  const endDateTime = new Date(workEntry.endTime);

  // Format date in YYYY-MM-DD format using local timezone
  const date =
    startDateTime.getFullYear() +
    '-' +
    String(startDateTime.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(startDateTime.getDate()).padStart(2, '0');

  // Format time in HH:MM format using local timezone
  const startTime =
    String(startDateTime.getHours()).padStart(2, '0') +
    ':' +
    String(startDateTime.getMinutes()).padStart(2, '0');
  const endTime =
    String(endDateTime.getHours()).padStart(2, '0') +
    ':' +
    String(endDateTime.getMinutes()).padStart(2, '0');

  return {
    date,
    startTime,
    endTime,
    description: workEntry.description,
  };
};

const EditWorkEntryForm: React.FC<EditWorkEntryFormProps> = ({
  workEntry,
  onSuccess,
  onCancel,
  className,
}) => {
  const updateWorkEntryMutation = useUpdateWorkEntry();

  const form = useForm<WorkEntryFormInput>({
    resolver: zodResolver(workEntryFormInputSchema),
    defaultValues: convertAPIToFormInput(workEntry),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  // Reset form when workEntry changes
  useEffect(() => {
    reset(convertAPIToFormInput(workEntry));
  }, [workEntry, reset]);

  const onSubmit = async (data: WorkEntryFormInput) => {
    try {
      // Convert form input to API format
      const apiData = convertFormInputToAPIFormat(data);
      const updatedWorkEntry = await updateWorkEntryMutation.mutateAsync({
        id: workEntry.id,
        data: apiData,
      });
      onSuccess?.(updatedWorkEntry);
    } catch (error) {
      console.error('Failed to update work entry:', error);
    }
  };

  const isLoading = isSubmitting || updateWorkEntryMutation.isPending;

  return (
    <Form className={className} onSubmit={handleSubmit(onSubmit)}>
      {/* General error message */}
      {updateWorkEntryMutation.error && (
        <FormMessage variant='destructive'>
          {updateWorkEntryMutation.error.message ||
            'Failed to update work entry'}
        </FormMessage>
      )}

      {/* Date field */}
      <FormField error={errors.date?.message}>
        <Label htmlFor='date' required>
          Date
        </Label>
        <Controller
          name='date'
          control={form.control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              error={errors.date?.message}
              max={getTodayString()} // Cannot select future dates
            />
          )}
        />
      </FormField>

      {/* Time fields in a row */}
      <div className='grid grid-cols-2 gap-4'>
        {/* Start time field */}
        <FormField error={errors.startTime?.message}>
          <Label htmlFor='startTime' required>
            Start Time
          </Label>
          <Input
            id='startTime'
            type='time'
            placeholder='09:00'
            {...register('startTime')}
            error={!!errors.startTime}
          />
        </FormField>

        {/* End time field */}
        <FormField error={errors.endTime?.message}>
          <Label htmlFor='endTime' required>
            End Time
          </Label>
          <Input
            id='endTime'
            type='time'
            placeholder='17:00'
            {...register('endTime')}
            error={!!errors.endTime}
          />
        </FormField>
      </div>

      {/* Description field */}
      <FormField error={errors.description?.message}>
        <Label htmlFor='description' required>
          Description
        </Label>
        <textarea
          id='description'
          rows={4}
          maxLength={500}
          placeholder='Describe the work performed...'
          className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          {...register('description')}
        />
      </FormField>

      {/* Form actions */}
      <div className='flex justify-end space-x-2'>
        {onCancel && (
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Work Entry'}
        </Button>
      </div>
    </Form>
  );
};

export default EditWorkEntryForm;
