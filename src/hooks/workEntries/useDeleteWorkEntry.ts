import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWorkEntry } from '../../api/workEntries';
import { queryKeys } from '../../lib/queryKeys';
import { useToast } from '../../components/ui';
import { createToastHelpers, TOAST_MESSAGES } from '../../lib/toast';

export const useDeleteWorkEntry = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const toast = createToastHelpers(showToast);

  return useMutation({
    mutationFn: (id: string | number) => deleteWorkEntry(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted work entry from cache
      queryClient.removeQueries({
        queryKey: queryKeys.workEntry.detail(deletedId),
      });

      // Invalidate and refetch work entries list
      queryClient.invalidateQueries({
        queryKey: queryKeys.workEntry.lists(),
      });

      // Invalidate work statistics
      queryClient.invalidateQueries({
        queryKey: queryKeys.statistics.all(),
      });

      // Show success toast
      toast.success(
        TOAST_MESSAGES.WORK_ENTRIES.DELETE_SUCCESS,
        'Work entry deleted successfully'
      );
    },
    onError: (error) => {
      console.error('Failed to delete work entry:', error);
      toast.error(
        TOAST_MESSAGES.WORK_ENTRIES.DELETE_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    },
  });
};
