/**
 * Profile Hook
 *
 * TanStack Query hook for fetching user profile data.
 * Integrates with AuthContext for state management.
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth, useAuthActions } from '../../contexts/AuthContext';
import { getProfile } from '../../api/auth';
import { queryKeys } from '../../lib/queryKeys';

/**
 * Hook for fetching user profile data
 *
 * @returns TanStack Query for user profile
 */
export const useProfile = () => {
  const { isAuthenticated, user } = useAuth();
  const { updateUser } = useAuthActions();

  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const profileData = await getProfile();

      // Update context with fresh profile data
      updateUser(profileData);

      return profileData;
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    initialData: user, // Use context user as initial data if available
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts
  });
};
