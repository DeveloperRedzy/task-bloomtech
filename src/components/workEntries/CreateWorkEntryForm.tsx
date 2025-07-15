import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateWorkEntry } from '../../hooks/workEntries';
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
import type { WorkEntryFormInput } from '../../types/workEntry';

export interface CreateWorkEntryFormProps {
  onSuccess?: (workEntry: any) => void;
  onCancel?: () => void;
  className?: string;
}

const CreateWorkEntryForm: React.FC<CreateWorkEntryFormProps> = ({
  onSuccess,
  onCancel,
  className,
}) => {
  const createWorkEntryMutation = useCreateWorkEntry();

  const form = useForm<WorkEntryFormInput>({
    resolver: zodResolver(workEntryFormInputSchema),
    defaultValues: {
      date: getTodayString(),
      startTime: '09:00',
      endTime: '17:00',
      description: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: WorkEntryFormInput) => {
    try {
      // Convert form input to API format
      const apiData = convertFormInputToAPIFormat(data);
      const workEntry = await createWorkEntryMutation.mutateAsync(apiData);
      onSuccess?.(workEntry);
      form.reset();
    } catch (error) {
      console.error('Failed to create work entry:', error);
    }
  };

  const isLoading = isSubmitting || createWorkEntryMutation.isPending;

  return (
    <Form className={className} onSubmit={handleSubmit(onSubmit)}>
      {/* General error message */}
      {createWorkEntryMutation.error && (
        <FormMessage variant='destructive'>
          {createWorkEntryMutation.error.message ||
            'Failed to create work entry'}
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
          {isLoading ? 'Creating...' : 'Create Work Entry'}
        </Button>
      </div>
    </Form>
  );
};

export default CreateWorkEntryForm;
