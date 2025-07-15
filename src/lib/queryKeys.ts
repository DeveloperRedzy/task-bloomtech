/**
 * Query Keys Factory
 *
 * Centralized management of query keys following TanStack Query best practices.
 * Using hierarchical keys for better cache invalidation and organization.
 */

export const queryKeys = {
  // Base keys for different entities
  authRoot: ['auth'] as const,
  workEntries: ['workEntries'] as const,
  stats: ['stats'] as const,

  // Authentication queries
  auth: {
    all: () => [...queryKeys.authRoot] as const,
    profile: () => [...queryKeys.authRoot, 'profile'] as const,
    tokens: () => [...queryKeys.authRoot, 'tokens'] as const,
  },

  // Work entry queries
  workEntry: {
    all: () => [...queryKeys.workEntries] as const,
    lists: () => [...queryKeys.workEntries, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.workEntries, 'list', filters] as const,
    details: () => [...queryKeys.workEntries, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.workEntries, 'detail', id] as const,
    infinite: (filters: Record<string, any>) =>
      [...queryKeys.workEntries, 'infinite', filters] as const,
  },

  // Statistics queries
  statistics: {
    all: () => [...queryKeys.stats] as const,
    workStats: (filters?: Record<string, any>) =>
      [...queryKeys.stats, 'work', filters] as const,
  },

  // Legacy keys (can be removed later if not needed)
  users: ['users'] as const,
  posts: ['posts'] as const,
  comments: ['comments'] as const,

  // User-specific queries (legacy - can be removed)
  user: {
    all: () => [...queryKeys.users] as const,
    lists: () => [...queryKeys.users, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.users, 'list', filters] as const,
    details: () => [...queryKeys.users, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.users, 'detail', id] as const,
    profile: (id: string | number) =>
      [...queryKeys.users, 'profile', id] as const,
  },

  // Post-specific queries (legacy - can be removed)
  post: {
    all: () => [...queryKeys.posts] as const,
    lists: () => [...queryKeys.posts, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.posts, 'list', filters] as const,
    details: () => [...queryKeys.posts, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.posts, 'detail', id] as const,
    byUser: (userId: string | number) =>
      [...queryKeys.posts, 'byUser', userId] as const,
  },

  // Comment-specific queries (legacy - can be removed)
  comment: {
    all: () => [...queryKeys.comments] as const,
    lists: () => [...queryKeys.comments, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.comments, 'list', filters] as const,
    details: () => [...queryKeys.comments, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.comments, 'detail', id] as const,
    byPost: (postId: string | number) =>
      [...queryKeys.comments, 'byPost', postId] as const,
  },
} as const;

/**
 * Example usage:
 *
 * // Authentication
 * queryKey: queryKeys.auth.profile()
 *
 * // Work entries - all
 * queryKey: queryKeys.workEntry.all()
 *
 * // Work entries - with filters
 * queryKey: queryKeys.workEntry.list({ page: 1, limit: 10, startDate: '2025-01-01' })
 *
 * // Specific work entry
 * queryKey: queryKeys.workEntry.detail(123)
 *
 * // Work statistics
 * queryKey: queryKeys.statistics.workStats({ startDate: '2025-01-01', endDate: '2025-01-31' })
 *
 * // Invalidation examples:
 *
 * // Invalidate all work entries
 * queryClient.invalidateQueries({ queryKey: queryKeys.workEntries })
 *
 * // Invalidate all work entry lists (keeps detail queries)
 * queryClient.invalidateQueries({ queryKey: queryKeys.workEntry.lists() })
 *
 * // Invalidate specific work entry
 * queryClient.invalidateQueries({ queryKey: queryKeys.workEntry.detail(123) })
 *
 * // Invalidate all auth queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.auth })
 *
 * // Invalidate user profile
 * queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() })
 */
