import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that unused/inactive cache data remains in memory
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Time in milliseconds that cache data stays fresh before being considered stale
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry for 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
});
