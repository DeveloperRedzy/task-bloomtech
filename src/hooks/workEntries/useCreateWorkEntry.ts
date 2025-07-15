import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkEntry } from '../../api/workEntries';
import { queryKeys } from '../../lib/queryKeys';
import { useToast } from '../../components/ui';
import { createToastHelpers, TOAST_MESSAGES } from '../../lib/toast';
import type { CreateWorkEntryData, WorkEntry } from '../../types/workEntry';

export const useCreateWorkEntry = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const toast = createToastHelpers(showToast);

  return useMutation({
    mutationFn: (data: CreateWorkEntryData) => createWorkEntry(data),
    onSuccess: (newWorkEntry: WorkEntry) => {
      // Invalidate and refetch work entries list
      queryClient.invalidateQueries({
        queryKey: queryKeys.workEntry.lists(),
      });

      // Invalidate work statistics
      queryClient.invalidateQueries({
        queryKey: queryKeys.statistics.all(),
      });

      // Optionally set the new work entry in cache
      queryClient.setQueryData(
        queryKeys.workEntry.detail(newWorkEntry.id),
        newWorkEntry
      );

      // Show success toast
      toast.success(
        TOAST_MESSAGES.WORK_ENTRIES.CREATE_SUCCESS,
        `Work entry for ${newWorkEntry.date} created successfully`
      );
    },
    onError: (error) => {
      console.error('Failed to create work entry:', error);
      toast.error(
        TOAST_MESSAGES.WORK_ENTRIES.CREATE_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    },
  });
};
