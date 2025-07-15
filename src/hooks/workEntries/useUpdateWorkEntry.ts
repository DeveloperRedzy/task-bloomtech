import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWorkEntry } from '../../api/workEntries';
import { queryKeys } from '../../lib/queryKeys';
import { useToast } from '../../components/ui';
import { createToastHelpers, TOAST_MESSAGES } from '../../lib/toast';
import type { UpdateWorkEntryData, WorkEntry } from '../../types/workEntry';

export interface UpdateWorkEntryParams {
  id: string | number;
  data: UpdateWorkEntryData;
}

export const useUpdateWorkEntry = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const toast = createToastHelpers(showToast);

  return useMutation({
    mutationFn: ({ id, data }: UpdateWorkEntryParams) =>
      updateWorkEntry(id, data),
    onSuccess: (updatedWorkEntry: WorkEntry) => {
      // Update the specific work entry in cache
      queryClient.setQueryData(
        queryKeys.workEntry.detail(updatedWorkEntry.id),
        updatedWorkEntry
      );

      // Invalidate and refetch work entries list to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.workEntry.lists(),
      });

      // Invalidate work statistics
      queryClient.invalidateQueries({
        queryKey: queryKeys.statistics.all(),
      });

      // Show success toast
      toast.success(
        TOAST_MESSAGES.WORK_ENTRIES.UPDATE_SUCCESS,
        `Work entry for ${updatedWorkEntry.date} updated successfully`
      );
    },
    onError: (error) => {
      console.error('Failed to update work entry:', error);
      toast.error(
        TOAST_MESSAGES.WORK_ENTRIES.UPDATE_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    },
  });
};
