import { useQuery } from '@tanstack/react-query';
import { getWorkEntries } from '../../api/workEntries';
import { queryKeys } from '../../lib/queryKeys';
import type { WorkEntryFilters } from '../../types/workEntry';

export interface UseWorkEntriesParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: 'startTime' | 'duration' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
  minHours?: number;
  maxHours?: number;
}

export const useWorkEntries = (params: UseWorkEntriesParams = {}) => {
  const { page = 1, limit = 10, ...otherParams } = params;

  const filters: WorkEntryFilters = {
    page,
    limit,
    ...otherParams,
  };

  return useQuery({
    queryKey: queryKeys.workEntry.list(filters),
    queryFn: () => getWorkEntries(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
