/**
 * Refresh Token Hook
 *
 * TanStack Query mutation hook for refreshing authentication tokens.
 * Integrates with AuthContext for token management.
 */

import { useMutation } from '@tanstack/react-query';
import { useAuthActions } from '../../contexts/AuthContext';
import {
  refreshToken as refreshTokenApi,
  getRefreshToken,
} from '../../api/auth';

/**
 * Hook for token refresh mutation
 *
 * @returns TanStack Query mutation for token refresh
 */
export const useRefresh = () => {
  const { updateTokens } = useAuthActions();

  return useMutation({
    mutationFn: async () => {
      const currentRefreshToken = getRefreshToken();

      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const tokenData = await refreshTokenApi({
        refreshToken: currentRefreshToken,
      });
      return tokenData;
    },

    onSuccess: (data) => {
      try {
        // Update context with new tokens
        updateTokens(data.accessToken, data.refreshToken);
      } catch (error) {
        console.error('Token refresh success handler failed:', error);
        throw error;
      }
    },

    onError: (error) => {
      console.error('Token refresh failed:', error);
      // Note: The calling code should handle logout on refresh failure
    },
  });
};
