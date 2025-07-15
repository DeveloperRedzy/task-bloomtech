import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Alert } from '../components/ui/alert';
import {
  WorkEntriesTable,
  CreateWorkEntryModal,
  EditWorkEntryModal,
  ViewWorkEntryModal,
} from '../components/workEntries';
import { WorkEntriesFilters } from '../components/workEntries/WorkEntriesFilters';
import type { WorkEntriesFiltersState } from '../components/workEntries/WorkEntriesFilters';
import { useWorkStats } from '../hooks/workEntries';
import { formatDuration } from '../api/workEntries';
import type { WorkEntry } from '../types/workEntry';

const WorkEntriesPage: React.FC = () => {
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedWorkEntry, setSelectedWorkEntry] = useState<WorkEntry | null>(
    null
  );

  // Filters state
  const [filters, setFilters] = useState<WorkEntriesFiltersState>({
    sortBy: 'startTime',
    sortOrder: 'desc',
  });

  // Pagination state
  const pagination = {
    page: 1,
    limit: 10,
  };

  // Combined filters for API calls - only include defined values to prevent API errors
  // Use higher limit when date filters are active since we're doing client-side filtering
  const hasDateFilter = filters.startDate || filters.endDate;
  const apiFilters = {
    ...pagination,
    // Increase limit when date filtering to get more data for client-side filtering
    limit: hasDateFilter ? Math.max(pagination.limit, 100) : pagination.limit,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    // Pass date filters for client-side filtering (not sent to API)
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
    ...(filters.minHours !== undefined && { minHours: filters.minHours }),
    ...(filters.maxHours !== undefined && { maxHours: filters.maxHours }),
  };

  // Fetch work statistics
  const {
    data: workStats,
    isLoading: statsLoading,
    error: statsError,
  } = useWorkStats({
    enabled: true, // Always load current stats
  });

  const handleCreateSuccess = (workEntry: WorkEntry) => {
    console.log('Work entry created:', workEntry);
    // The table will automatically update due to query invalidation
  };

  const handleEditClick = (workEntry: WorkEntry) => {
    setSelectedWorkEntry(workEntry);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (workEntry: WorkEntry) => {
    console.log('Work entry updated:', workEntry);
    setSelectedWorkEntry(null);
    // The table will automatically update due to query invalidation
  };

  const handleViewClick = (workEntry: WorkEntry) => {
    setSelectedWorkEntry(workEntry);
    setViewModalOpen(true);
  };

  const handleViewEdit = (workEntry: WorkEntry) => {
    setViewModalOpen(false);
    setSelectedWorkEntry(workEntry);
    setEditModalOpen(true);
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Work Entries</h1>
          <p className='text-muted-foreground'>
            Track your work time and manage your entries
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button onClick={() => setCreateModalOpen(true)}>
            Add Work Entry
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Hours</CardTitle>
            <div className='h-4 w-4 text-muted-foreground'>⏱️</div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {statsLoading
                ? '...'
                : formatDuration(workStats?.totalHours || 0)}
            </div>
            <p className='text-xs text-muted-foreground'>Total time tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Entries</CardTitle>
            <div className='h-4 w-4 text-muted-foreground'>📋</div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {statsLoading ? '...' : workStats?.totalEntries || '0'}
            </div>
            <p className='text-xs text-muted-foreground'>
              Work entries recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Average Hours</CardTitle>
            <div className='h-4 w-4 text-muted-foreground'>📊</div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {statsLoading
                ? '...'
                : formatDuration(workStats?.averageHours || 0)}
            </div>
            <p className='text-xs text-muted-foreground'>Per work entry</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Error */}
      {statsError && (
        <Alert className='border-destructive text-destructive'>
          <div className='font-medium'>Failed to load statistics</div>
          <div className='text-sm'>
            Unable to load work statistics. The data below may still be
            available.
          </div>
        </Alert>
      )}

      {/* Work Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Entries</CardTitle>
          <p className='text-sm text-muted-foreground'>
            View and manage all your work entries
          </p>
        </CardHeader>
        <CardContent>
          <WorkEntriesFilters
            onFiltersChange={setFilters}
            initialFilters={filters}
          />
          <WorkEntriesTable
            filters={apiFilters}
            onEdit={handleEditClick}
            onView={handleViewClick}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateWorkEntryModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditWorkEntryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        workEntry={selectedWorkEntry}
        onSuccess={handleEditSuccess}
      />

      <ViewWorkEntryModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        workEntry={selectedWorkEntry}
        onEdit={handleViewEdit}
      />
    </div>
  );
};

export default WorkEntriesPage;
