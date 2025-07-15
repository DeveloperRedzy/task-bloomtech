import { useQuery } from '@tanstack/react-query';
import { getWorkEntry } from '../../api/workEntries';
import { queryKeys } from '../../lib/queryKeys';

export const useWorkEntry = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.workEntry.detail(id),
    queryFn: () => getWorkEntry(id),
    enabled: !!id, // Only run query if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
