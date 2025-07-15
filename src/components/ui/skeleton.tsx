import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

// Table skeleton for loading work entries
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => (
  <div className={cn('w-full space-y-3', className)}>
    {/* Header */}
    <div className='flex space-x-4'>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className='h-4 flex-1' />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className='flex space-x-4'>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className='h-4 flex-1' />
        ))}
      </div>
    ))}
  </div>
);

// Card skeleton for loading individual items
export interface CardSkeletonProps {
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ className }) => (
  <div className={cn('space-y-3', className)}>
    <Skeleton className='h-4 w-[250px]' />
    <Skeleton className='h-4 w-[200px]' />
    <Skeleton className='h-4 w-[150px]' />
  </div>
);

// Form skeleton for loading forms
export interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 3,
  className,
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className='space-y-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-10 w-full' />
      </div>
    ))}
    <Skeleton className='h-10 w-[120px]' />
  </div>
);

export { Skeleton, TableSkeleton, CardSkeleton, FormSkeleton };
