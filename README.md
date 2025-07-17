# BloomTeq Work Tracker - Frontend Application

A production-ready React application for tracking working hours with comprehensive analytics, built with React 19, TypeScript, TanStack Query, and modern UI components.

## 🚀 Project Overview

This application provides a modern, user-friendly frontend for managing personal work time entries with real-time analytics and advanced filtering capabilities. Users can register, authenticate, and manage their work logs with features including:

- **Modern Authentication**: Secure JWT-based registration and login with session management
- **Real-Time Work Tracking**: Create, edit, view, and delete work entries with optimistic updates
- **Advanced Analytics Dashboard**: Comprehensive statistics with productivity metrics and trends
- **Powerful Filtering System**: Filter by date ranges, search descriptions, duration, and sorting
- **Professional UI/UX**: Modern design with warm BloomTeq branding and responsive layout
- **Accessibility First**: ARIA compliance, keyboard navigation, and screen reader support
- **Performance Optimized**: Code splitting, lazy loading, and intelligent caching
- **Comprehensive Testing**: Unit, integration, and E2E test coverage with 80%+ thresholds

## 🛠 Technology Stack

### Core Technologies

- **Framework**: React 19.1 with modern concurrent features
- **Language**: TypeScript 5.8 with strict mode
- **Build Tool**: Vite 5.4 for lightning-fast development
- **Styling**: Tailwind CSS 4.1 with custom design system
- **State Management**: TanStack Query 5.82 for server state

### UI & Components

- **Component Library**: Custom components built on Radix UI primitives
- **Icons**: Lucide React for beautiful SVG icons
- **Forms**: React Hook Form 7.60 with Zod validation
- **Routing**: React Router DOM 7.6 with protected routes
- **Animations**: CSS animations with Tailwind

### Development & Testing

- **Testing Framework**: Vitest 2.1 for unit testing
- **Component Testing**: React Testing Library 16.3
- **E2E Testing**: Playwright 1.54 for end-to-end testing
- **API Mocking**: MSW (Mock Service Worker) 2.10
- **Code Quality**: ESLint 9.30 + TypeScript ESLint

### Why These Technologies?

1. **React 19**: Latest React with concurrent features for better performance
2. **TypeScript**: Complete type safety across the entire application
3. **TanStack Query**: Powerful server state management with caching and optimistic updates
4. **Vite**: Lightning-fast build tool with HMR for excellent developer experience
5. **Tailwind CSS**: Utility-first CSS for rapid UI development with custom design system
6. **Vitest**: Native Vite integration for fast, reliable testing

## 📁 Project Structure

```
task-bloomteq-frontend/
├── src/
│   ├── api/                    # API service layer and HTTP client
│   │   ├── auth.ts            # Authentication API calls
│   │   ├── client.ts          # Base HTTP client with interceptors
│   │   ├── index.ts           # API exports
│   │   └── workEntries.ts     # Work entries API calls
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── common/            # Common utility components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── PageErrorBoundary.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── ui/                # Base UI components
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── toast.tsx
│   │   └── workEntries/       # Work entry specific components
│   │       ├── CreateWorkEntryForm.tsx
│   │       ├── EditWorkEntryForm.tsx
│   │       ├── StatsDashboard.tsx
│   │       ├── WorkEntriesFilters.tsx
│   │       └── WorkEntriesTable.tsx
│   ├── contexts/              # React Context providers
│   │   └── AuthContext.tsx    # Authentication context
│   ├── hooks/                 # Custom React hooks
│   │   ├── auth/              # Authentication hooks
│   │   │   ├── useLogin.ts
│   │   │   ├── useLogout.ts
│   │   │   ├── useProfile.ts
│   │   │   └── useRegister.ts
│   │   └── workEntries/       # Work entry hooks
│   │       ├── useCreateWorkEntry.ts
│   │       ├── useDeleteWorkEntry.ts
│   │       ├── useUpdateWorkEntry.ts
│   │       ├── useWorkEntries.ts
│   │       └── useWorkStats.ts
│   ├── lib/                   # Core utilities and configuration
│   │   ├── queryClient.ts     # TanStack Query configuration
│   │   ├── queryKeys.ts       # Centralized query key management
│   │   ├── router.tsx         # React Router configuration
│   │   ├── toast.ts           # Toast notification system
│   │   ├── utils.ts           # General utility functions
│   │   └── validations.ts     # Zod validation schemas
│   ├── pages/                 # Page components
│   │   ├── DashboardPage.tsx  # Main dashboard
│   │   ├── LoginPage.tsx      # Authentication pages
│   │   ├── RegisterPage.tsx
│   │   ├── WorkEntriesPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── test/                  # Testing utilities and setup
│   │   ├── fixtures/          # Test data fixtures
│   │   ├── mocks/             # MSW API mocks
│   │   ├── utils.tsx          # Testing utilities
│   │   └── setup.ts           # Test environment setup
│   ├── types/                 # TypeScript type definitions
│   │   ├── api.ts             # API response types
│   │   ├── auth.ts            # Authentication types
│   │   └── workEntry.ts       # Work entry types
│   ├── App.tsx                # Root application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles and Tailwind imports
├── e2e/                       # End-to-end testing
│   ├── fixtures/              # E2E test data
│   ├── pages/                 # Page Object Models
│   └── specs/                 # E2E test specifications
├── public/                    # Static assets
├── coverage/                  # Test coverage reports
├── components.json            # shadcn/ui configuration
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest testing configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Project dependencies and scripts
├── DEVELOPMENT_PLAN.md       # Detailed development roadmap
├── TESTING_STRATEGY.md       # Comprehensive testing strategy
└── README.md                 # This documentation
```

## 🎨 UI Design System

### BloomTeq Brand Identity

The application features a professional, warm design system:

- **Primary Color**: Warm Terra Cotta (#D2956B) for buttons and accents
- **Background**: Light Beige (#FAF9F7) for inviting, comfortable feeling
- **Typography**: Dark Brown (#2D2D2D) and Medium Gray (#6B6B6B) for readability
- **Cards**: Pure White backgrounds with subtle shadows for depth
- **Border Radius**: 0.75rem for modern, rounded styling
- **Dark Mode**: Warm tones maintained for brand consistency

### Component Architecture

- **Atomic Design**: Base components → Composite components → Page layouts
- **Accessibility First**: ARIA labels, keyboard navigation, screen reader support
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Performance**: Lazy loading, code splitting, and optimized re-renders

## 🔐 Application Features

### Authentication System

```
/auth/login     # User login with email/password
/auth/register  # User registration with validation
/dashboard      # Protected dashboard (redirects if not authenticated)
/work-entries   # Protected work entries management
```

### Work Entry Management

- **Create Entries**: Date, start/end times, and description with validation
- **Edit Entries**: Update existing entries with optimistic updates
- **View Entries**: Detailed view with formatted time displays
- **Delete Entries**: Confirmation dialogs with undo capabilities

### Advanced Filtering & Search

- **Date Range**: Custom date picker with validation (no future dates)
- **Search**: Real-time search through work descriptions
- **Duration Filters**: Min/max hours with quarter-hour precision
- **Sorting**: Multiple sort options (date, duration, description)
- **Active Filters**: Visual filter badges with individual removal

### Analytics Dashboard

- **Statistics Cards**: Total hours, entry count, average hours
- **Productivity Metrics**: Weekly trends and comparisons
- **Performance Insights**: Longest streaks, most productive days
- **Visual Charts**: Time distribution and productivity patterns

## 🗄 Data Models

### Work Entry Interface

```typescript
interface WorkEntry {
  id: string;
  userId: string;
  startTime: string; // ISO 8601 datetime
  endTime: string; // ISO 8601 datetime
  duration: number; // Hours (calculated from time difference)
  description: string; // Max 500 characters
  createdAt: string;
  updatedAt: string;
}
```

### User Interface

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
```

### API Response Format

```typescript
// Paginated work entries response
interface WorkEntriesResponse {
  data: WorkEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Statistics response
interface WorkStatsResponse {
  totalHours: number;
  totalEntries: number;
  averageHours: number;
  // Additional metrics...
}
```

## 🚦 Getting Started

### Prerequisites

- **Node.js 18.x** or higher ([Download](https://nodejs.org/))
- **npm 8.x** or **yarn 1.22** or higher
- **Git** for version control
- **Modern Browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Quick Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/task-bloomteq-frontend.git
cd task-bloomteq-frontend
```

2. **Install dependencies**

```bash
# Using npm
npm install

# Using yarn
yarn install
```

3. **Environment setup**

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your configuration
nano .env.local
```

4. **Start development server**

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

5. **Open in browser**

Visit `http://localhost:5173` to see the application.

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME="BloomTeq Work Tracker"
VITE_APP_VERSION="1.0.0"

# Authentication
VITE_JWT_STORAGE_KEY=bloomteq_auth_token
VITE_REFRESH_TOKEN_KEY=bloomteq_refresh_token

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true

# Development
VITE_ENABLE_DEVTOOLS=true
VITE_LOG_LEVEL=debug
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

## 🧪 Testing Strategy

### Test Types & Coverage

- **Unit Tests (70%)**: Components, hooks, utilities with 80%+ coverage
- **Integration Tests (25%)**: Page-level testing and user workflows
- **E2E Tests (5%)**: Critical user journeys across browsers

### Running Tests

```bash
# Run all tests
npm test

# Interactive test UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Run specific test file
npm test -- WorkEntriesTable.test.tsx

# End-to-end testing
npm run e2e

# E2E with browser UI
npm run e2e:headed

# E2E test UI
npm run e2e:ui
```

### Test Coverage Reports

After running `npm run test:coverage`, open `coverage/index.html` for detailed coverage reports.

**Current Coverage Thresholds:**

- **Statements**: 80% minimum
- **Branches**: 80% minimum
- **Functions**: 80% minimum
- **Lines**: 80% minimum

### Testing Best Practices

```typescript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { TestProvider } from '../test/utils';
import { WorkEntriesTable } from './WorkEntriesTable';

test('should display work entries in table format', async () => {
  render(
    <TestProvider>
      <WorkEntriesTable />
    </TestProvider>
  );

  expect(screen.getByText('Frontend Development')).toBeInTheDocument();
  expect(screen.getByText('8h 0m')).toBeInTheDocument();
});

// E2E testing example
test('should create new work entry', async ({ page }) => {
  await page.goto('/work-entries');
  await page.click('[data-testid="add-entry-button"]');

  await page.fill('[data-testid="description-input"]', 'Development work');
  await page.click('[data-testid="submit-button"]');

  await expect(page.locator('text=Development work')).toBeVisible();
});
```

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure authentication with access/refresh token pattern
- **Protected Routes**: Route guards prevent unauthorized access
- **Session Management**: Automatic token refresh and secure logout
- **Input Validation**: Comprehensive validation with XSS prevention

### Data Protection

- **Form Validation**: Zod schemas with type-safe validation
- **API Security**: Request/response validation and error handling
- **Local Storage**: Secure token storage with proper cleanup
- **CSRF Protection**: Request headers and origin validation

### UI Security

- **Content Security**: Sanitized user inputs and outputs
- **Route Protection**: Authentication guards on sensitive pages
- **Error Handling**: Graceful error states without data exposure
- **Audit Logging**: User action tracking for security monitoring

## ⚡ Performance Features

### Build Optimization

- **Code Splitting**: Lazy-loaded routes and components
- **Tree Shaking**: Dead code elimination with Vite
- **Bundle Analysis**: Optimized chunk sizing
- **Asset Optimization**: Compressed images and fonts

### Runtime Performance

- **React 19 Features**: Concurrent rendering and automatic batching
- **TanStack Query**: Intelligent caching and background updates
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: Efficient rendering of large datasets

### Caching Strategy

- **Query Caching**: 5-minute stale time with 30-minute garbage collection
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Background Refresh**: Automatic data refresh on window focus
- **Cache Invalidation**: Strategic cache updates on mutations

### Performance Metrics

Current application performance:

- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.8s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB gzipped

## 📊 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server with HMR
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run lint             # Run ESLint code analysis
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run unit tests interactively
npm run test:ui          # Visual test interface
npm run test:run         # CI/CD test execution
npm run test:coverage    # Generate coverage reports
npm run test:watch       # Watch mode for development
npm run e2e              # End-to-end testing
npm run e2e:headed       # E2E with browser UI
npm run e2e:ui           # E2E test interface

# Code Quality
npm run format           # Format code with Prettier
npm run lint:fix         # Auto-fix ESLint issues
npm run analyze          # Bundle size analysis
```

### Code Standards

- **ESLint**: TypeScript and React best practices
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode with comprehensive type checking
- **Conventional Commits**: Standardized commit message format
- **Pre-commit Hooks**: Automated linting and testing

### Git Workflow

```bash
# Feature development
git checkout -b feature/work-entry-filtering
git add .
git commit -m "feat: add advanced filtering for work entries"
git push origin feature/work-entry-filtering

# Code review process
# Create pull request → Review → Tests pass → Merge
```

## 🔌 Backend Integration

This frontend application integrates with the BloomTeq Work Tracker Backend API. For complete setup:

1. **Backend Repository**: [task-bloomtech-backend](https://github.com/your-username/task-bloomtech-backend)
2. **API Documentation**: See backend README for endpoint details
3. **Environment Setup**: Ensure backend is running on `http://localhost:3000`

### API Endpoints Used

```
# Authentication
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/refresh      # Token refresh
GET  /api/auth/profile      # User profile

# Work Entries
GET    /api/work-entries              # Get paginated entries
POST   /api/work-entries              # Create new entry
GET    /api/work-entries/:id          # Get specific entry
PUT    /api/work-entries/:id          # Update entry
DELETE /api/work-entries/:id          # Delete entry

# Statistics
GET    /api/work-entries/stats        # Get work statistics
```

### API Integration Examples

```typescript
// Creating a work entry
const createEntry = async (entryData: CreateWorkEntryData) => {
  const response = await apiClient.post('/work-entries', entryData);
  return response.data;
};

// Fetching with filters
const getWorkEntries = async (filters: WorkEntryFilters) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/work-entries?${params}`);
  return response.data;
};
```

## 🤝 Development Guidelines

### Component Development

```typescript
// Component template with proper TypeScript
interface ComponentProps {
  title: string;
  onAction?: () => void;
  variant?: 'primary' | 'secondary';
}

export const ExampleComponent: React.FC<ComponentProps> = ({
  title,
  onAction,
  variant = 'primary',
}) => {
  return (
    <div className={cn('component-base', variant)}>
      <h2>{title}</h2>
      {onAction && <Button onClick={onAction}>Action</Button>}
    </div>
  );
};
```

### Hook Development

```typescript
// Custom hook with proper typing and error handling
export const useWorkEntries = (filters?: WorkEntryFilters) => {
  return useQuery({
    queryKey: queryKeys.workEntries.list(filters),
    queryFn: () => workEntriesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.status === 404) return false;
      return failureCount < 3;
    },
  });
};
```

### Testing Guidelines

- **Test file naming**: `Component.test.tsx` for unit tests
- **Test data**: Use factories and fixtures for consistent test data
- **User-centric testing**: Test user interactions, not implementation details
- **Accessibility testing**: Include ARIA and keyboard navigation tests

## 📚 Additional Documentation

- **[Development Plan](./DEVELOPMENT_PLAN.md)**: Detailed project roadmap and implementation phases
- **[Testing Strategy](./TESTING_STRATEGY.md)**: Comprehensive testing approach and best practices
- **[TanStack Query Guide](./TANSTACK_QUERY_GUIDE.md)**: Server state management patterns
- **[Phase 1 Summary](./PHASE_1_SUMMARY.md)**: Foundation implementation details
- **[Testing Implementation Summary](./TESTING_IMPLEMENTATION_SUMMARY.md)**: Testing infrastructure overview

## 🐛 Common Issues & Solutions

### Development Issues

**Issue**: `Failed to resolve import` errors

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript compilation errors

```bash
# Solution: Check and update TypeScript configuration
npx tsc --noEmit
```

**Issue**: Test failures in CI/CD

```bash
# Solution: Run tests locally with same environment
npm run test:run
```

### Runtime Issues

**Issue**: Authentication not persisting

- Check localStorage for tokens
- Verify API endpoints are correct
- Check browser developer console for errors

**Issue**: API requests failing

- Verify backend is running on correct port
- Check CORS configuration
- Verify environment variables

## 📈 Performance Monitoring

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for unused dependencies
npx depcheck

# Performance audit
npm run preview
# Run Lighthouse audit in browser DevTools
```

### Monitoring Metrics

Key metrics to monitor in production:

- **Core Web Vitals**: LCP, FID, CLS scores
- **Bundle Size**: JavaScript and CSS bundle sizes
- **API Performance**: Request/response times
- **Error Rates**: JavaScript errors and API failures
- **User Engagement**: Page views, session duration

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👥 Contributors

- **Rijad Kuloglija** - _Lead Developer_ - [@redzydeveloper](https://github.com/redzydeveloper)

## 🙏 Acknowledgments

- **React Team** for the amazing React 19 features
- **TanStack** for the powerful data fetching library
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Vite Team** for the lightning-fast build tool

---

**Built with ❤️ for BloomTeq Technical Assessment**

_This frontend application showcases modern React development practices, comprehensive testing strategies, and production-ready architecture suitable for real-world applications._

## 🆘 Need Help?

- **Documentation**: Start with this README and linked documentation
- **Issues**: Check [GitHub Issues](https://github.com/your-username/task-bloomteq-frontend/issues) for known problems
- **Questions**: Open a [Discussion](https://github.com/your-username/task-bloomteq-frontend/discussions) for general questions
- **Bug Reports**: Use the [Issue Template](https://github.com/your-username/task-bloomteq-frontend/issues/new) for bug reports

**Response Times:**

- **Bug Reports**: 24-48 hours
- **Feature Requests**: 3-5 business days
- **General Questions**: 1-2 business days
