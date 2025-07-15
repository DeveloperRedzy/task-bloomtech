/**
 * Dashboard Page
 *
 * Main authenticated dashboard showing user profile and work entries.
 * Protected by AuthGuard component.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../components/auth';
import { useAuth } from '../hooks/auth';
import { useWorkEntries, useWorkStats } from '../hooks/workEntries';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { StatsDashboard } from '../components/workEntries/StatsDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch recent work entries
  const { data: recentEntries, isLoading: entriesLoading } = useWorkEntries({
    limit: 5,
    sortBy: 'startTime',
    sortOrder: 'desc',
  });

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Welcome back, {user?.firstName}!
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Track your work hours and manage your time entries
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* User Profile Section */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <UserProfile />
              </CardContent>
            </Card>
          </div>

          {/* Recent Work Entries */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle>Recent Work Entries</CardTitle>
                  <Link to='/work-entries'>
                    <Button variant='outline' size='sm'>
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {entriesLoading ? (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                    <p className='text-sm text-gray-500 mt-2'>
                      Loading entries...
                    </p>
                  </div>
                ) : !recentEntries?.data?.length ? (
                  <div className='text-center py-8'>
                    <p className='text-gray-500 mb-4'>No work entries yet</p>
                    <Link to='/work-entries'>
                      <Button>Create Your First Entry</Button>
                    </Link>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {recentEntries.data.map((entry) => (
                      <div
                        key={entry.id}
                        className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
                      >
                        <div>
                          <p className='font-medium text-gray-900 dark:text-white'>
                            {entry.description}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {new Date(entry.startTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium text-gray-900 dark:text-white'>
                            {entry.duration.toFixed(2)}h
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className='mt-8'>
          <StatsDashboard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
