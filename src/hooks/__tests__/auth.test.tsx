import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createFullWrapper } from '../../test/utils';
import { mockUser } from '../../test/fixtures';
import {
  useLogin,
  useLogout,
  useRegister,
  useProfile,
  useRefresh,
} from '../auth';

describe('Auth Hooks', () => {
  describe('useLogin', () => {
    it('should return mutation object with correct properties', () => {
      const wrapper = createFullWrapper();
      const { result } = renderHook(() => useLogin(), { wrapper });

      // Check that it returns a TanStack Query mutation object
      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('isSuccess');
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('error');

      // Check function types
      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
    });

    it('should have correct initial state', () => {
      const wrapper = createFullWrapper();
      const { result } = renderHook(() => useLogin(), { wrapper });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useLogout', () => {
    it('should return mutation object with correct properties', () => {
      const wrapper = createFullWrapper();
      const { result } = renderHook(() => useLogout(), { wrapper });

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('isSuccess');

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
    });

    it('should have correct initial state', () => {
      const wrapper = createFullWrapper();
      const { result } = renderHook(() => useLogout(), { wrapper });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('useRegister', () => {
    it('should return mutation object with correct properties', () => {
      const wrapper = createFullWrapper();
      const { result } = renderHook(() => useRegister(), { wrapper });

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('isSuccess');
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('error');

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
    });

    it('should have correct initial state', () => {
      const wrapper = createFullWrapper();
      const { result } = renderHook(() => useRegister(), { wrapper });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useProfile', () => {
    it('should return query object with correct properties', () => {
      const wrapper = createFullWrapper(mockUser);
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Check that it returns a TanStack Query query object
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('isSuccess');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should be disabled when no user is authenticated', () => {
      const wrapper = createFullWrapper(undefined);
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Query should be disabled when no user is available
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
    });

    it('should handle authenticated user state', () => {
      const wrapper = createFullWrapper(mockUser);
      const { result } = renderHook(() => useProfile(), { wrapper });

      // With authenticated user, query should be enabled
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(result.current).toHaveProperty('data');
    });
  });

  describe('useRefresh', () => {
    it('should return mutation object with correct properties', () => {
      const wrapper = createFullWrapper(mockUser);
      const { result } = renderHook(() => useRefresh(), { wrapper });

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('isSuccess');

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
    });

    it('should have correct initial state', () => {
      const wrapper = createFullWrapper(mockUser);
      const { result } = renderHook(() => useRefresh(), { wrapper });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('Hook integration and consistency', () => {
    it('should have consistent mutation interfaces across auth hooks', () => {
      const wrapper = createFullWrapper();

      const { result: loginResult } = renderHook(() => useLogin(), { wrapper });
      const { result: logoutResult } = renderHook(() => useLogout(), {
        wrapper,
      });
      const { result: registerResult } = renderHook(() => useRegister(), {
        wrapper,
      });
      const { result: refreshResult } = renderHook(() => useRefresh(), {
        wrapper,
      });

      const mutationHooks = [
        loginResult,
        logoutResult,
        registerResult,
        refreshResult,
      ];

      // All mutation hooks should have similar structure
      mutationHooks.forEach((hook) => {
        expect(hook.current).toHaveProperty('mutate');
        expect(hook.current).toHaveProperty('mutateAsync');
        expect(hook.current).toHaveProperty('isPending');
        expect(hook.current).toHaveProperty('isError');
        expect(hook.current).toHaveProperty('isSuccess');

        expect(typeof hook.current.mutate).toBe('function');
        expect(typeof hook.current.mutateAsync).toBe('function');
        expect(typeof hook.current.isPending).toBe('boolean');
        expect(typeof hook.current.isError).toBe('boolean');
        expect(typeof hook.current.isSuccess).toBe('boolean');
      });
    });

    it('should handle different authentication states correctly', () => {
      // Test with authenticated user
      const authenticatedWrapper = createFullWrapper(mockUser);
      const { result: authProfileResult } = renderHook(() => useProfile(), {
        wrapper: authenticatedWrapper,
      });

      // Test with unauthenticated user
      const unauthenticatedWrapper = createFullWrapper(undefined);
      const { result: unauthProfileResult } = renderHook(() => useProfile(), {
        wrapper: unauthenticatedWrapper,
      });

      // Profile query should behave differently based on auth state
      expect(typeof authProfileResult.current.isLoading).toBe('boolean');
      expect(authProfileResult.current).toHaveProperty('data');

      expect(unauthProfileResult.current.isLoading).toBe(false);
      expect(unauthProfileResult.current.data).toBeNull();
    });

    it('should be properly typed with TypeScript', () => {
      const wrapper = createFullWrapper();

      // Test that hooks return the expected types without TypeScript errors
      const { result: loginResult } = renderHook(() => useLogin(), { wrapper });
      const { result: profileResult } = renderHook(() => useProfile(), {
        wrapper,
      });

      // These should not cause TypeScript errors
      expect(loginResult.current.mutate).toBeDefined();
      expect(profileResult.current.refetch).toBeDefined();

      // Check that mutation accepts correct parameter types
      expect(() => {
        const loginData = {
          email: 'test@example.com',
          password: 'password123',
        };
        loginResult.current.mutate(loginData);
      }).not.toThrow();
    });
  });
});
