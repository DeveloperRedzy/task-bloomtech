import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from './button';

const paginationVariants = cva(
  'mx-1 flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground',
        active: 'bg-primary text-primary-foreground hover:bg-primary/90',
        disabled: 'pointer-events-none opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  className?: string;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    { currentPage, totalPages, onPageChange, showFirstLast = true, className },
    ref
  ) => {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const getVisiblePages = () => {
      const delta = 2; // Show 2 pages before and after current page
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    if (totalPages <= 1) {
      return null;
    }

    return (
      <nav
        ref={ref}
        role='navigation'
        aria-label='Pagination Navigation'
        className={cn('flex items-center justify-center space-x-1', className)}
      >
        {/* First page button */}
        {showFirstLast && currentPage > 1 && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(1)}
            className='hidden sm:flex'
          >
            First
          </Button>
        )}

        {/* Previous button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={cn(
            paginationVariants({
              variant: canGoPrevious ? 'default' : 'disabled',
            })
          )}
        >
          ‹
        </Button>

        {/* Page numbers */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className='flex h-9 w-9 items-center justify-center'>
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  paginationVariants({
                    variant: currentPage === page ? 'active' : 'default',
                  })
                )}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(
            paginationVariants({
              variant: canGoNext ? 'default' : 'disabled',
            })
          )}
        >
          ›
        </Button>

        {/* Last page button */}
        {showFirstLast && currentPage < totalPages && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(totalPages)}
            className='hidden sm:flex'
          >
            Last
          </Button>
        )}
      </nav>
    );
  }
);
Pagination.displayName = 'Pagination';

// Pagination info component
export interface PaginationInfoProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

const PaginationInfo = React.forwardRef<HTMLDivElement, PaginationInfoProps>(
  ({ currentPage, totalItems, itemsPerPage, className }, ref) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div ref={ref} className={cn('text-sm text-muted-foreground', className)}>
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
    );
  }
);
PaginationInfo.displayName = 'PaginationInfo';

export { Pagination, PaginationInfo };
