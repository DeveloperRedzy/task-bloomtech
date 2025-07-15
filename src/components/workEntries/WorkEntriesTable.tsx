import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  SimpleDropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  TableSkeleton,
  SimpleAlert,
  Pagination,
} from '../ui';
import { useWorkEntries } from '../../hooks/workEntries';
import { useDeleteWorkEntry } from '../../hooks/workEntries/useDeleteWorkEntry';
import DeleteWorkEntryDialog from './DeleteWorkEntryDialog';
import type { WorkEntry } from '../../types/workEntry';
import type { UseWorkEntriesParams } from '../../hooks/workEntries/useWorkEntries';
import { formatDateTime, formatDuration } from '../../api/workEntries';

export interface WorkEntriesTableProps {
  onEdit?: (workEntry: WorkEntry) => void;
  onView?: (workEntry: WorkEntry) => void;
  filters?: UseWorkEntriesParams;
  className?: string;
}

const WorkEntriesTable: React.FC<WorkEntriesTableProps> = ({
  onEdit,
  onView,
  filters = {},
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(filters.page || 1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workEntryToDelete, setWorkEntryToDelete] = useState<WorkEntry | null>(
    null
  );

  const {
    data: workEntriesData,
    isLoading,
    error,
    refetch,
  } = useWorkEntries({
    ...filters,
    page: currentPage,
    limit: filters.limit || 10,
  });

  const deleteWorkEntryMutation = useDeleteWorkEntry();

  const handleDelete = (workEntry: WorkEntry) => {
    setWorkEntryToDelete(workEntry);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!workEntryToDelete) return;

    setDeletingId(workEntryToDelete.id);
    try {
      await deleteWorkEntryMutation.mutateAsync(workEntryToDelete.id);
      setWorkEntryToDelete(null);
    } catch (error) {
      console.error('Failed to delete work entry:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (isoDateTime: string) => {
    const date = new Date(isoDateTime);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeOnly = (isoDateTime: string) => {
    const date = new Date(isoDateTime);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Use 24-hour format for consistency
    });
  };

  const formatDateTimeRange = (startTime: string, endTime: string) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // If same date, show date once with time range
    if (startDate.toDateString() === endDate.toDateString()) {
      return {
        date: formatDate(startTime),
        timeRange: `${formatTimeOnly(startTime)} - ${formatTimeOnly(endTime)}`,
      };
    } else {
      // Different dates (overnight), show full datetime range
      return {
        date: 'Multi-day',
        timeRange: `${formatDateTime(startTime)} - ${formatDateTime(endTime)}`,
      };
    }
  };

  // Client-side filtering for search term, duration range, and date range (since API doesn't support these)
  const filteredWorkEntries = React.useMemo(() => {
    if (!workEntriesData?.data?.length) {
      return [];
    }

    let filtered = workEntriesData.data;

    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((entry) =>
        entry.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by duration range
    if (filters.minHours !== undefined) {
      filtered = filtered.filter(
        (entry) => entry.duration >= filters.minHours!
      );
    }

    if (filters.maxHours !== undefined) {
      filtered = filtered.filter(
        (entry) => entry.duration <= filters.maxHours!
      );
    }

    // Filter by date range (client-side since server rejects date parameters)
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.startTime.split('T')[0]);
        return entryDate >= startDate;
      });
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.startTime.split('T')[0]);
        return entryDate <= endDate;
      });
    }

    return filtered;
  }, [
    workEntriesData?.data,
    filters.searchTerm,
    filters.minHours,
    filters.maxHours,
    filters.startDate,
    filters.endDate,
  ]);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className={className}>
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className={className}>
        <SimpleAlert
          variant='destructive'
          title='Failed to load work entries'
          description={
            error.message || 'An error occurred while loading work entries.'
          }
        />
        <Button onClick={() => refetch()} className='mt-4'>
          Try Again
        </Button>
      </div>
    );
  }

  // Show empty state
  if (!workEntriesData?.data?.length) {
    return (
      <div className={className}>
        <SimpleAlert
          title='No work entries found'
          description="You haven't created any work entries yet."
        />
      </div>
    );
  }

  // Show empty state for filtered results
  if (
    filteredWorkEntries.length === 0 &&
    (filters.searchTerm ||
      filters.minHours !== undefined ||
      filters.maxHours !== undefined)
  ) {
    const activeFilters = [];
    if (filters.searchTerm)
      activeFilters.push(`search "${filters.searchTerm}"`);
    if (filters.minHours !== undefined)
      activeFilters.push(`minimum ${filters.minHours}h`);
    if (filters.maxHours !== undefined)
      activeFilters.push(`maximum ${filters.maxHours}h`);

    return (
      <div className={className}>
        <SimpleAlert
          title='No matching work entries found'
          description={`No work entries match your filters: ${activeFilters.join(
            ', '
          )}. Try adjusting your filter criteria.`}
        />
      </div>
    );
  }

  const { pagination } = workEntriesData;

  return (
    <div className={className}>
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time Range</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className='w-[100px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWorkEntries.map((workEntry) => {
            const { date, timeRange } = formatDateTimeRange(
              workEntry.startTime,
              workEntry.endTime
            );

            return (
              <TableRow key={workEntry.id}>
                <TableCell className='font-medium'>{date}</TableCell>
                <TableCell className='font-mono text-sm'>{timeRange}</TableCell>
                <TableCell>{formatDuration(workEntry.duration)}</TableCell>
                <TableCell>
                  <div
                    className='max-w-md truncate'
                    title={workEntry.description}
                  >
                    {workEntry.description}
                  </div>
                </TableCell>
                <TableCell>
                  <SimpleDropdownMenu
                    trigger={
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                        disabled={deletingId === workEntry.id}
                      >
                        <span className='sr-only'>Open menu</span>⋮
                      </Button>
                    }
                    align='end'
                  >
                    {onView && (
                      <>
                        <DropdownMenuItem onClick={() => onView(workEntry)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(workEntry)}>
                        Edit
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDelete(workEntry)}
                      className='text-destructive focus:text-destructive'
                    >
                      {deletingId === workEntry.id ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </SimpleDropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className='mt-4'>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteWorkEntryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        workEntry={workEntryToDelete}
        onConfirm={handleConfirmDelete}
        isLoading={!!deletingId}
      />
    </div>
  );
};

export default WorkEntriesTable;
