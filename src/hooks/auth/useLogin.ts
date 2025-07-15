/**
 * Login Hook
 *
 * TanStack Query mutation hook for user authentication.
 * Integrates with AuthContext for state management.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthActions } from '../../contexts/AuthContext';
import { login as loginApi } from '../../api/auth';
import type { LoginCredentials } from '../../types/auth';
import { queryKeys } from '../../lib/queryKeys';

/**
 * Hook for user login mutation
 *
 * @returns TanStack Query mutation for login
 */
export const useLogin = () => {
  const { login } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await loginApi(credentials);
      return response;
    },

    onSuccess: async (data) => {
      try {
        // Update auth context with user and tokens
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
        console.error('Login success handler failed:', error);
        throw error;
      }
    },

    onError: (error) => {
      console.error('Login failed:', error);
      // Clear any potentially stale auth data
      queryClient.removeQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};
