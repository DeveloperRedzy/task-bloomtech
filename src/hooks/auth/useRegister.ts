/**
 * Register Hook
 *
 * TanStack Query mutation hook for user registration.
 * Integrates with AuthContext for state management.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthActions } from '../../contexts/AuthContext';
import { register as registerApi } from '../../api/auth';
import type { RegisterData } from '../../types/auth';
import { queryKeys } from '../../lib/queryKeys';

/**
 * Hook for user registration mutation
 *
 * @returns TanStack Query mutation for registration
 */
export const useRegister = () => {
  const { login } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await registerApi(userData);
      return response;
    },

    onSuccess: async (data) => {
      try {
        // Automatically log in the user after successful registration
        await login(
          data.user,
          data.tokens.accessToken,
          data.tokens.refreshToken
        );

        // Invalidate and refetch auth-related queries
        await queryClient.invalidateQueries({
          queryKey: queryKeys.auth.profile(),
        });

        // Prefetch user profile data
        queryClient.setQueryData(queryKeys.auth.profile(), data.user);
      } catch (error) {
        console.error('Registration success handler failed:', error);
        throw error;
      }
    },

    onError: (error) => {
      console.error('Registration failed:', error);
      // Clear any potentially stale auth data
      queryClient.removeQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};
