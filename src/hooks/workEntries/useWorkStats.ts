import { useQuery } from '@tanstack/react-query';
import { getWorkStats } from '../../api/workEntries';
import { queryKeys } from '../../lib/queryKeys';
import type { WorkStatsFilters } from '../../types/workEntry';

export interface UseWorkStatsParams {
  startDate?: string;
  endDate?: string;
  enabled?: boolean; // Allow disabling the query
}

export const useWorkStats = (params: UseWorkStatsParams = {}) => {
  const { startDate, endDate, enabled = true } = params;

  const filters: WorkStatsFilters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  return useQuery({
    queryKey: queryKeys.statistics.workStats(filters),
    queryFn: () => getWorkStats(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter since stats change frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
