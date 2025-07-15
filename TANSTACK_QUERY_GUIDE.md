# TanStack Query Setup Guide

## Project Structure

We've organized the TanStack Query implementation with the following structure:

```
src/
├── api/                    # API service layer
│   └── client.ts          # Base HTTP client with error handling
├── hooks/                 # Custom TanStack Query hooks
├── lib/                   # Core configuration
│   ├── queryClient.ts     # Query client configuration
│   └── queryKeys.ts       # Centralized query key management
└── types/                 # TypeScript type definitions
```

## Core Setup

### 1. Query Client Configuration (`src/lib/queryClient.ts`)

The query client is configured with optimized defaults:

- **Stale Time**: 5 minutes (data stays fresh)
- **GC Time**: 30 minutes (cache retention)
- **Smart Retry Logic**: No retry for 4xx errors, up to 3 retries for others
- **Focus Refetch**: Disabled for better UX

### 2. Query Keys Management (`src/lib/queryKeys.ts`)

Hierarchical query key system for efficient cache invalidation:

```typescript
// Examples
queryKeys.user.all(); // ['users']
queryKeys.user.detail(123); // ['users', 'detail', 123]
queryKeys.user.list({ status: 'active' }); // ['users', 'list', { status: 'active' }]
```

**Benefits:**

- Easy cache invalidation at any level
- Type-safe query keys
- Consistent naming convention
- Better debugging experience

### 3. API Client (`src/api/client.ts`)

Centralized HTTP client with:

- Automatic token handling
- Global error handling
- Request/response interceptors
- Type-safe API calls

## Best Practices

### Query Keys

- Use hierarchical structure for related data
- Include relevant parameters in query keys
- Invalidate at appropriate levels

### API Layer

- One service file per entity/domain
- Pure functions for API calls
- Consistent error handling
- Proper TypeScript typing

### Custom Hooks

- Wrap TanStack Query hooks for reusability
- Include domain-specific logic
- Provide sensible defaults
- Export both hook and query options

### Error Handling

- Use React Query's built-in error boundaries
- Implement global error handling
- Provide user-friendly error messages
- Log errors for debugging

## File Organization Guidelines

### API Services (`src/api/`)

```typescript
// src/api/users.ts
export const getUsers = async (params) => {
  /* ... */
};
export const getUser = async (id) => {
  /* ... */
};
export const createUser = async (data) => {
  /* ... */
};
```

### Custom Hooks (`src/hooks/`)

```typescript
// src/hooks/useUsers.ts
export const useUsers = (params) => {
  return useQuery({
    queryKey: queryKeys.user.list(params),
    queryFn: () => getUsers(params),
    // hook-specific options
  });
};
```

### TypeScript Types (`src/types/`)

```typescript
// src/types/user.ts
export interface User {
  id: number;
  name: string;
  // ...
}

export interface CreateUserData {
  name: string;
  // ...
}
```

## Environment Variables

Add to your `.env` file:

```
VITE_API_BASE_URL=https://your-api.com/api
```

## Integration with Components

### Basic Query

```typescript
import { useUsers } from '@/hooks/useUsers';

function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Mutation

```typescript
import { useCreateUser } from '@/hooks/useUsers';

function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = (userData) => {
    createUser.mutate(userData, {
      onSuccess: () => {
        // Handle success
      },
      onError: (error) => {
        // Handle error
      },
    });
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Cache Management

### Invalidation Patterns

```typescript
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: queryKeys.users });

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: queryKeys.user.detail(123) });

// Update cache directly
queryClient.setQueryData(queryKeys.user.detail(123), newUserData);
```

### Optimistic Updates

```typescript
const updateUser = useMutation({
  mutationFn: updateUserApi,
  onMutate: async (newUserData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.user.detail(id) });

    // Snapshot previous value
    const previousUser = queryClient.getQueryData(queryKeys.user.detail(id));

    // Optimistically update
    queryClient.setQueryData(queryKeys.user.detail(id), newUserData);

    return { previousUser };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previousUser) {
      queryClient.setQueryData(queryKeys.user.detail(id), context.previousUser);
    }
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: queryKeys.user.detail(id) });
  },
});
```

## Development Tools

### React Query DevTools

Add to your app for debugging:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

## Next Steps

1. Create specific API service files based on your backend endpoints
2. Define TypeScript interfaces for your data models
3. Build custom hooks for common query patterns
4. Implement error boundaries for graceful error handling
5. Add React Query DevTools for development

The foundation is now set up for scalable and maintainable data fetching with TanStack Query!
