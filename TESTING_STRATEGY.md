# BloomTeq Work Tracker - Testing Strategy

## Overview

Comprehensive testing strategy implementing industry best practices for a production-ready React/TypeScript application using modern testing tools and methodologies.

## Testing Philosophy

- **Test-Driven Development (TDD)** approach for new features
- **User-Centric Testing** focusing on user behaviors and workflows
- **Comprehensive Coverage** across unit, integration, and E2E levels
- **Performance-First** testing ensuring optimal user experience
- **Accessibility-Driven** testing for inclusive design
- **Continuous Integration** with automated testing pipelines

## Testing Pyramid Strategy

```
    /\
   /  \     E2E Tests (5-10%)
  /____\    Critical user workflows, browser compatibility
 /      \
/________\   Integration Tests (20-30%)
|        |   Component interactions, API integration, routing
|        |
|________|   Unit Tests (60-70%)
             Components, hooks, utilities, business logic
```

## Technology Stack

### Core Testing Frameworks

- **Vitest** - Ultra-fast unit testing with native Vite integration
- **React Testing Library** - Component testing with user-centric approach
- **Playwright** - Modern E2E testing with cross-browser support
- **MSW (Mock Service Worker)** - API mocking for reliable testing

### Additional Tools

- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - Advanced user interaction simulation
- **@axe-core/playwright** - Automated accessibility testing
- **lighthouse-ci** - Performance testing and monitoring
- **@storybook/test-runner** - Visual regression testing

## Phase 9.1: Testing Infrastructure Setup

### 9.1.1 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 9.1.2 React Testing Library Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// MSW Server Setup
beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

### 9.1.3 Testing Utilities

```typescript
// src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Phase 9.2: Unit Testing Implementation

### 9.2.1 Component Testing Standards

```typescript
// Example: WorkEntryCard.test.tsx
import { render, screen } from '@/test/utils';
import { WorkEntryCard } from '@/components/WorkEntryCard';
import { mockWorkEntry } from '@/test/mocks/workEntry';

describe('WorkEntryCard', () => {
  it('should display work entry information correctly', () => {
    render(<WorkEntryCard entry={mockWorkEntry} />);

    expect(screen.getByText(mockWorkEntry.description)).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('should handle edit action when clicked', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    render(<WorkEntryCard entry={mockWorkEntry} onEdit={onEdit} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(mockWorkEntry);
  });
});
```

### 9.2.2 Hook Testing Standards

```typescript
// Example: useWorkEntries.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useWorkEntries } from '@/hooks/workEntries/useWorkEntries';
import { createQueryWrapper } from '@/test/utils';

describe('useWorkEntries', () => {
  it('should fetch work entries successfully', async () => {
    const { result } = renderHook(
      () => useWorkEntries({ page: 1, limit: 10 }),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toHaveLength(5);
  });
});
```

### 9.2.3 Utility Function Testing

```typescript
// Example: formatDuration.test.ts
import { formatDuration } from '@/utils/formatDuration';

describe('formatDuration', () => {
  it('should format hours and minutes correctly', () => {
    expect(formatDuration(2.5)).toBe('2h 30m');
    expect(formatDuration(1)).toBe('1h 0m');
    expect(formatDuration(0.25)).toBe('0h 15m');
  });

  it('should handle edge cases', () => {
    expect(formatDuration(0)).toBe('0h 0m');
    expect(formatDuration(-1)).toBe('0h 0m');
  });
});
```

## Phase 9.3: Integration Testing

### 9.3.1 Page-Level Testing

```typescript
// Example: DashboardPage.integration.test.tsx
import { render, screen, waitFor } from '@/test/utils';
import { DashboardPage } from '@/pages/DashboardPage';
import { server } from '@/test/mocks/server';

describe('DashboardPage Integration', () => {
  it('should display user dashboard with work entries and stats', async () => {
    render(<DashboardPage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    // Check stats cards
    expect(screen.getByText('Total Hours')).toBeInTheDocument();
    expect(screen.getByText('Total Entries')).toBeInTheDocument();

    // Check recent work entries
    expect(screen.getByText('Recent Work Entries')).toBeInTheDocument();
  });
});
```

### 9.3.2 User Workflow Testing

```typescript
// Example: WorkEntryManagement.workflow.test.tsx
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { WorkEntriesPage } from '@/pages/WorkEntriesPage';

describe('Work Entry Management Workflow', () => {
  it('should complete full CRUD workflow', async () => {
    const user = userEvent.setup();
    render(<WorkEntriesPage />);

    // Create new work entry
    await user.click(screen.getByRole('button', { name: /add work entry/i }));

    await user.type(screen.getByLabelText(/description/i), 'Test Entry');
    await user.type(screen.getByLabelText(/start time/i), '09:00');
    await user.type(screen.getByLabelText(/end time/i), '17:00');

    await user.click(screen.getByRole('button', { name: /save/i }));

    // Verify entry appears in table
    await waitFor(() => {
      expect(screen.getByText('Test Entry')).toBeInTheDocument();
    });

    // Edit entry
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/description/i));
    await user.type(screen.getByLabelText(/description/i), 'Updated Entry');
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Verify update
    await waitFor(() => {
      expect(screen.getByText('Updated Entry')).toBeInTheDocument();
    });
  });
});
```

## Phase 9.4: E2E Testing with Playwright

### 9.4.1 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 9.4.2 E2E Test Examples

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login and access dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email-input"]', 'test@bloomteq.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });
});

// e2e/work-entries.spec.ts
test.describe('Work Entries Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@bloomteq.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
  });

  test('should create, edit, and delete work entry', async ({ page }) => {
    await page.goto('/work-entries');

    // Create entry
    await page.click('[data-testid="add-entry-button"]');
    await page.fill('[data-testid="description-input"]', 'E2E Test Entry');
    await page.fill('[data-testid="start-time-input"]', '09:00');
    await page.fill('[data-testid="end-time-input"]', '17:00');
    await page.click('[data-testid="save-button"]');

    await expect(page.locator('text=E2E Test Entry')).toBeVisible();

    // Edit entry
    await page.click('[data-testid="edit-button"]');
    await page.fill('[data-testid="description-input"]', 'Updated E2E Entry');
    await page.click('[data-testid="save-button"]');

    await expect(page.locator('text=Updated E2E Entry')).toBeVisible();

    // Delete entry
    await page.click('[data-testid="delete-button"]');
    await page.click('[data-testid="confirm-delete"]');

    await expect(page.locator('text=Updated E2E Entry')).not.toBeVisible();
  });
});
```

## Phase 9.5: Accessibility Testing

### 9.5.1 Automated A11y Testing

```typescript
// src/test/a11y.test.ts
import { render } from '@/test/utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DashboardPage } from '@/pages/DashboardPage';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations on dashboard', async () => {
    const { container } = render(<DashboardPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 9.5.2 Keyboard Navigation Testing

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('should navigate work entries table with keyboard', async ({ page }) => {
    await page.goto('/work-entries');

    // Tab through interactive elements
    await page.press('body', 'Tab');
    await expect(
      page.locator('[data-testid="add-entry-button"]')
    ).toBeFocused();

    await page.press('body', 'Tab');
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused();

    // Test keyboard shortcuts
    await page.press('body', 'Control+k');
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused();
  });
});
```

## Test Organization & Standards

### File Structure

```
src/
├── test/
│   ├── __mocks__/           # Module mocks
│   ├── fixtures/            # Test data fixtures
│   ├── mocks/              # MSW API mocks
│   ├── utils.tsx           # Test utilities
│   └── setup.ts            # Test setup
├── components/
│   └── __tests__/          # Component tests
├── hooks/
│   └── __tests__/          # Hook tests
├── pages/
│   └── __tests__/          # Page integration tests
└── utils/
    └── __tests__/          # Utility tests

e2e/
├── fixtures/               # E2E test data
├── pages/                  # Page Object Models
└── specs/                  # E2E test specs
```

### Naming Conventions

- **Unit Tests**: `ComponentName.test.tsx`
- **Integration Tests**: `PageName.integration.test.tsx`
- **E2E Tests**: `feature-name.spec.ts`
- **Mock Files**: `serviceName.mock.ts`

### Test Data Management

```typescript
// src/test/fixtures/workEntry.ts
export const mockWorkEntry = {
  id: '1',
  description: 'Development work',
  startTime: '2025-01-15T09:00:00Z',
  endTime: '2025-01-15T17:00:00Z',
  duration: 8,
  userId: 'user1',
};

export const mockWorkEntries = [
  mockWorkEntry,
  { ...mockWorkEntry, id: '2', description: 'Testing work' },
];
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Critical Path Coverage

- Authentication flows: 95%
- Work entry CRUD operations: 95%
- Data filtering and search: 90%
- Navigation and routing: 90%

## Performance Testing

### Lighthouse CI Integration

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Audit URLs using Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
```

### Performance Benchmarks

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Accessibility Score**: > 95

## Implementation Timeline

### Week 1: Infrastructure Setup

- [ ] Configure Vitest and React Testing Library
- [ ] Set up MSW for API mocking
- [ ] Create testing utilities and helpers
- [ ] Implement basic unit test examples

### Week 2: Component Testing

- [ ] Write unit tests for all UI components
- [ ] Test custom hooks thoroughly
- [ ] Implement utility function tests
- [ ] Achieve 80% unit test coverage

### Week 3: Integration Testing

- [ ] Create page-level integration tests
- [ ] Test user workflows end-to-end
- [ ] Verify API integration points
- [ ] Test routing and navigation

### Week 4: E2E and Accessibility

- [ ] Set up Playwright for E2E testing
- [ ] Implement critical user journey tests
- [ ] Add accessibility testing with axe
- [ ] Performance testing with Lighthouse

This comprehensive testing strategy ensures the BloomTeq Work Tracker meets the highest quality standards with robust, maintainable test coverage across all application layers.
