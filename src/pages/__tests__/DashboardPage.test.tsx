import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import DashboardPage from '../DashboardPage';

// Mock the hooks
vi.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    isAuthenticated: true,
  }),
}));

vi.mock('../../hooks/workEntries', () => ({
  useWorkEntries: () => ({
    data: [
      {
        id: 1,
        title: 'Morning Task',
        description: 'Working on project',
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        date: '2024-01-15',
        duration: 180, // 3 hours in minutes
      },
      {
        id: 2,
        title: 'Afternoon Task',
        description: 'Code review',
        startTime: '2024-01-15T13:00:00Z',
        endTime: '2024-01-15T17:00:00Z',
        date: '2024-01-15',
        duration: 240, // 4 hours in minutes
      },
    ],
    isLoading: false,
    error: null,
  }),
  useWorkStats: () => ({
    data: {
      totalHours: 7,
      totalEntries: 2,
      averageHoursPerDay: 3.5,
      thisWeekHours: 7,
    },
    isLoading: false,
    error: null,
  }),
}));

describe('DashboardPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the dashboard with user greeting', async () => {
    render(<DashboardPage />);

    // Check for personalized greeting
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    expect(
      screen.getByText(/here's your work summary for today/i)
    ).toBeInTheDocument();
  });

  it('should display recent work entries section', async () => {
    render(<DashboardPage />);

    // Check for recent entries section
    expect(screen.getByText(/recent work entries/i)).toBeInTheDocument();

    // Wait for entries to load and check content
    await waitFor(() => {
      expect(screen.getByText('Morning Task')).toBeInTheDocument();
      expect(screen.getByText('Afternoon Task')).toBeInTheDocument();
    });
  });

  it('should display statistics dashboard', async () => {
    render(<DashboardPage />);

    // Check for stats section
    expect(screen.getByText(/work summary/i)).toBeInTheDocument();
  });

  it('should render navigation links', async () => {
    render(<DashboardPage />);

    // Check for navigation to work entries
    const viewAllLink = screen.getByRole('link', { name: /view all entries/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/work-entries');
  });

  it('should render quick action buttons', async () => {
    render(<DashboardPage />);

    // Check for quick action buttons
    expect(
      screen.getByRole('button', { name: /new entry/i })
    ).toBeInTheDocument();
  });

  it('should handle loading state gracefully', async () => {
    // Mock loading state
    vi.doMock('../../hooks/workEntries', () => ({
      useWorkEntries: () => ({
        data: null,
        isLoading: true,
        error: null,
      }),
    }));

    const LoadingDashboard = (await import('../DashboardPage')).default;

    render(<LoadingDashboard />);

    // Should show loading state
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
  });

  it('should display empty state when no entries exist', async () => {
    // Mock empty state
    vi.doMock('../../hooks/workEntries', () => ({
      useWorkEntries: () => ({
        data: [],
        isLoading: false,
        error: null,
      }),
    }));

    const EmptyDashboard = (await import('../DashboardPage')).default;

    render(<EmptyDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no work entries yet/i)).toBeInTheDocument();
    });
  });

  it('should be responsive and accessible', async () => {
    render(<DashboardPage />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Welcome back, John!');

    // Check for card structure
    const cards = screen.getAllByRole('region');
    expect(cards.length).toBeGreaterThan(0);
  });
});
