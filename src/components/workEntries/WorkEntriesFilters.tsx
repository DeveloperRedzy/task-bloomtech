import React, { useState } from 'react';
import { DateRangePicker } from '../ui/date-picker';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SimpleSelect, Badge } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  SortAsc,
  SortDesc,
} from 'lucide-react';

export interface WorkEntriesFiltersProps {
  onFiltersChange: (filters: WorkEntriesFiltersState) => void;
  initialFilters?: Partial<WorkEntriesFiltersState>;
}

export interface WorkEntriesFiltersState {
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: 'startTime' | 'duration' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  minHours?: number;
  maxHours?: number;
}

export const WorkEntriesFilters: React.FC<WorkEntriesFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<WorkEntriesFiltersState>({
    sortBy: 'startTime',
    sortOrder: 'desc',
    ...initialFilters,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<WorkEntriesFiltersState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: WorkEntriesFiltersState = {
      sortBy: 'startTime',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Boolean(
    filters.startDate ||
      filters.endDate ||
      filters.searchTerm ||
      filters.minHours ||
      filters.maxHours
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.startDate || filters.endDate) count++;
    if (filters.searchTerm) count++;
    if (filters.minHours !== undefined) count++;
    if (filters.maxHours !== undefined) count++;
    return count;
  };

  return (
    <Card className='mb-6'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filters
            {hasActiveFilters && (
              <Badge variant='secondary' className='ml-2'>
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className='flex items-center gap-2'>
            {hasActiveFilters && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='text-muted-foreground hover:text-foreground'
              >
                <X className='h-4 w-4 mr-1' />
                Clear
              </Button>
            )}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Always visible: Search and Sort */}
        <div className='flex gap-4 items-end'>
          <div className='flex-1'>
            <label className='text-sm font-medium text-gray-700 mb-2 block'>
              Search
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search descriptions...'
                value={filters.searchTerm || ''}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                className='pl-10'
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Sort By
              </label>
              <SimpleSelect
                value={filters.sortBy}
                onValueChange={(value: string) =>
                  updateFilters({
                    sortBy: value as WorkEntriesFiltersState['sortBy'],
                  })
                }
              >
                <option value='startTime'>Date</option>
                <option value='duration'>Duration</option>
              </SimpleSelect>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Order
              </label>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  updateFilters({
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  })
                }
                className='h-10 px-3'
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className='h-4 w-4' />
                ) : (
                  <SortDesc className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable filters */}
        {isExpanded && (
          <div className='space-y-4 pt-4 border-t'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <DateRangePicker
                  label='Date Range'
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  onStartDateChange={(date) =>
                    updateFilters({ startDate: date })
                  }
                  onEndDateChange={(date) => updateFilters({ endDate: date })}
                />
              </div>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Duration Range (hours)
                  </label>
                  <div className='flex gap-2 items-center'>
                    <Input
                      type='number'
                      step='0.25'
                      min='0'
                      max='24'
                      placeholder='Min'
                      value={filters.minHours || ''}
                      onChange={(e) =>
                        updateFilters({
                          minHours: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className='flex-1'
                    />
                    <span className='text-sm text-muted-foreground'>to</span>
                    <Input
                      type='number'
                      step='0.25'
                      min='0'
                      max='24'
                      placeholder='Max'
                      value={filters.maxHours || ''}
                      onChange={(e) =>
                        updateFilters({
                          maxHours: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className='flex-1'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 pt-2 border-t'>
            <span className='text-sm text-muted-foreground'>
              Active filters:
            </span>
            {(filters.startDate || filters.endDate) && (
              <Badge variant='secondary' className='gap-1'>
                <Calendar className='h-3 w-3' />
                {filters.startDate && filters.endDate
                  ? `${filters.startDate} - ${filters.endDate}`
                  : filters.startDate
                  ? `From ${filters.startDate}`
                  : `Until ${filters.endDate}`}
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-auto p-0 ml-1'
                  onClick={() =>
                    updateFilters({ startDate: undefined, endDate: undefined })
                  }
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            )}
            {filters.searchTerm && (
              <Badge variant='secondary' className='gap-1'>
                <Search className='h-3 w-3' />"{filters.searchTerm}"
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-auto p-0 ml-1'
                  onClick={() => updateFilters({ searchTerm: undefined })}
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            )}
            {(filters.minHours !== undefined ||
              filters.maxHours !== undefined) && (
              <Badge variant='secondary' className='gap-1'>
                <Clock className='h-3 w-3' />
                {filters.minHours !== undefined &&
                filters.maxHours !== undefined
                  ? `${filters.minHours}h - ${filters.maxHours}h`
                  : filters.minHours !== undefined
                  ? `≥ ${filters.minHours}h`
                  : `≤ ${filters.maxHours}h`}
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-auto p-0 ml-1'
                  onClick={() =>
                    updateFilters({ minHours: undefined, maxHours: undefined })
                  }
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkEntriesFilters;
