/**
 * Logout Hook
 *
 * TanStack Query mutation hook for user logout.
 * Integrates with AuthContext for state management and cache cleanup.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthActions } from '../../contexts/AuthContext';
import { logout as logoutApi } from '../../api/auth';
import { queryKeys } from '../../lib/queryKeys';

/**
 * Hook for user logout mutation
 *
 * @returns TanStack Query mutation for logout
 */
export const useLogout = () => {
  const { logout } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call API logout (mainly for local cleanup)
      await logoutApi();
    },

    onSuccess: async () => {
      try {
        // Update auth context (clears state and local storage)
        await logout();

        // Clear all cached data
        queryClient.clear();

        // Remove specific auth queries
        queryClient.removeQueries({ queryKey: queryKeys.auth.all() });
        queryClient.removeQueries({ queryKey: queryKeys.workEntry.all() });
        queryClient.removeQueries({ queryKey: queryKeys.statistics.all() });

        // Reset any persisted data
        queryClient.resetQueries();
      } catch (error) {
        console.error('Logout cleanup failed:', error);
        // Still proceed with logout even if cleanup fails
      }
    },

    onError: (error) => {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      try {
        logout();
        queryClient.clear();
      } catch (cleanupError) {
        console.error('Force logout cleanup failed:', cleanupError);
      }
    },
  });
};
