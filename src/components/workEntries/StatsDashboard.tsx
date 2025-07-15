import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Target,
  Activity,
} from 'lucide-react';
import { useWorkStats } from '../../hooks/workEntries';
import { useWorkEntries } from '../../hooks/workEntries';
import { formatDuration } from '../../api/workEntries';
import LoadingSpinner from '../ui/loading-spinner';
import { Alert } from '../ui/alert';

interface StatsDashboardProps {
  filters?: any;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  filters = {},
  dateRange = {},
}) => {
  const {
    data: workStats,
    isLoading: statsLoading,
    error: statsError,
  } = useWorkStats();

  // Get recent entries for trend analysis
  const { data: recentEntries, isLoading: entriesLoading } = useWorkEntries({
    limit: 30,
    sortBy: 'startTime',
    sortOrder: 'desc',
    ...dateRange,
  });

  const workEntries = recentEntries?.data || [];

  // Calculate additional metrics
  const calculateMetrics = () => {
    if (!workEntries.length) return null;

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const thisWeekEntries = workEntries.filter(
      (entry) => new Date(entry.startTime) >= lastWeek
    );

    const lastWeekEntries = workEntries.filter((entry) => {
      const entryDate = new Date(entry.startTime);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(today.getDate() - 14);
      return entryDate >= twoWeeksAgo && entryDate < lastWeek;
    });

    const thisWeekHours = thisWeekEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );
    const lastWeekHours = lastWeekEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );

    const weeklyChange =
      lastWeekHours > 0
        ? ((thisWeekHours - lastWeekHours) / lastWeekHours) * 100
        : 0;

    // Daily averages
    const dailyHours = workEntries.reduce((acc, entry) => {
      const date = entry.startTime.split('T')[0]; // Extract YYYY-MM-DD from ISO string
      acc[date] = (acc[date] || 0) + entry.duration;
      return acc;
    }, {} as Record<string, number>);

    const dailyAverages = Object.values(dailyHours);
    const avgDailyHours =
      dailyAverages.length > 0
        ? dailyAverages.reduce((sum, hours) => sum + hours, 0) /
          dailyAverages.length
        : 0;

    // Most productive day
    const mostProductiveDay = Object.entries(dailyHours).reduce(
      (max, [date, hours]) => (hours > max.hours ? { date, hours } : max),
      { date: '', hours: 0 }
    );

    // Longest streak
    const sortedDates = Object.keys(dailyHours).sort();
    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const previousDate = i > 0 ? new Date(sortedDates[i - 1]) : null;

      if (
        previousDate &&
        currentDate.getTime() - previousDate.getTime() === 24 * 60 * 60 * 1000
      ) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      longestStreak = Math.max(longestStreak, currentStreak);
    }

    return {
      thisWeekHours,
      lastWeekHours,
      weeklyChange,
      avgDailyHours,
      mostProductiveDay,
      longestStreak,
      workingDays: Object.keys(dailyHours).length,
    };
  };

  const metrics = calculateMetrics();

  if (statsLoading || entriesLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='pb-2'>
              <LoadingSpinner size='sm' />
            </CardHeader>
            <CardContent>
              <LoadingSpinner size='md' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (statsError) {
    return (
      <Alert className='border-destructive text-destructive'>
        <div className='font-medium'>Failed to load statistics</div>
        <div className='text-sm'>
          Unable to load work statistics. Please try again.
        </div>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Main Statistics */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Hours</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {workStats?.totalHours?.toFixed(2) || '0.00'}h
            </div>
            <p className='text-xs text-muted-foreground'>Total time tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Entries</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {workStats?.totalEntries || '0'}
            </div>
            <p className='text-xs text-muted-foreground'>
              Work entries recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Average Hours</CardTitle>
            <Target className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {workStats?.averageHours
                ? formatDuration(workStats.averageHours)
                : '0h 0m'}
            </div>
            <p className='text-xs text-muted-foreground'>Per work entry</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>This Week</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {metrics?.thisWeekHours?.toFixed(2) || '0.00'}h
            </div>
            <p className='text-xs text-muted-foreground flex items-center'>
              {metrics?.weeklyChange !== undefined && (
                <>
                  {metrics.weeklyChange > 0 ? (
                    <TrendingUp className='h-3 w-3 text-green-500 mr-1' />
                  ) : (
                    <TrendingDown className='h-3 w-3 text-red-500 mr-1' />
                  )}
                  {Math.abs(metrics.weeklyChange).toFixed(1)}% from last week
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      {metrics && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Daily Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xl font-bold'>
                {metrics.avgDailyHours.toFixed(2)}h
              </div>
              <p className='text-xs text-muted-foreground'>
                Based on {metrics.workingDays} working days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Most Productive Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xl font-bold'>
                {metrics.mostProductiveDay.hours.toFixed(2)}h
              </div>
              <p className='text-xs text-muted-foreground'>
                on {metrics.mostProductiveDay.date}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Longest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xl font-bold'>
                {metrics.longestStreak} days
              </div>
              <p className='text-xs text-muted-foreground'>
                Consecutive working days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity Chart (Simple Bar Chart) */}
      {workEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {workEntries.slice(0, 7).map((entry, index) => (
                <div
                  key={entry.id}
                  className='flex items-center justify-between'
                >
                  <div className='text-sm text-muted-foreground'>
                    {entry.startTime.split('T')[0]}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div
                      className='bg-primary h-2 rounded'
                      style={{
                        width: `${Math.min((entry.duration / 8) * 100, 100)}%`,
                        minWidth: '20px',
                      }}
                    />
                    <span className='text-sm font-medium w-12 text-right'>
                      {entry.duration}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsDashboard;
