import React from 'react';
import type { ReactElement } from 'react';
import { render, screen, within } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../components/ui/toast-provider';
import { mockUser } from './fixtures';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  user?: typeof mockUser | null;
}

// Create a test query client with disabled retries for faster tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Test providers wrapper
const AllTheProviders = ({
  children,
  user = mockUser,
  queryClient = createTestQueryClient(),
}: {
  children: React.ReactNode;
  user?: typeof mockUser | null;
  queryClient?: QueryClient;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function with all providers
const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { user = mockUser, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders user={user}>{children}</AllTheProviders>
  );

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Create a query client wrapper for hook testing
export const createQueryWrapper = () => {
  const queryClient = createTestQueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Create a full wrapper with all providers for hook testing
export const createFullWrapper = (user = mockUser) => {
  const queryClient = createTestQueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders user={user} queryClient={queryClient}>
      {children}
    </AllTheProviders>
  );
};

// Helper function to wait for loading states to finish
export const waitForLoadingToFinish = () =>
  screen.findByRole('status', { hidden: true }).catch(() => {
    // If no loading indicator is found, just wait a bit
    return new Promise((resolve) => setTimeout(resolve, 100));
  });

// Helper function to find elements by test ID
export const getByTestId = (testId: string) => screen.getByTestId(testId);
export const queryByTestId = (testId: string) => screen.queryByTestId(testId);
export const findByTestId = (testId: string) => screen.findByTestId(testId);

// Helper function to find elements within a container by test ID
export const withinTestId = (testId: string) => within(getByTestId(testId));

// Helper function to create mock form data
export const createMockFormEvent = (data: Record<string, string>) => ({
  preventDefault: vi.fn(),
  target: {
    elements: Object.entries(data).reduce((acc, [name, value]) => {
      acc[name] = { value };
      return acc;
    }, {} as Record<string, { value: string }>),
  },
});

// Helper function to mock console methods for testing
export const mockConsole = () => {
  const originalConsole = global.console;
  const mockMethods = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  };

  beforeEach(() => {
    global.console = { ...originalConsole, ...mockMethods };
  });

  afterEach(() => {
    global.console = originalConsole;
    Object.values(mockMethods).forEach((mock) => mock.mockClear());
  });

  return mockMethods;
};

// Helper to simulate API responses
export const createMockApiResponse = <T,>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Helper to simulate API errors
export const createMockApiError = (
  message = 'API Error',
  status = 500,
  delay = 0
) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };
