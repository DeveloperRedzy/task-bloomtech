import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
} from '../ui';
import type { WorkEntry } from '../../types/workEntry';

export interface ViewWorkEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workEntry: WorkEntry | null;
  onEdit?: (workEntry: WorkEntry) => void;
}

const ViewWorkEntryModal: React.FC<ViewWorkEntryModalProps> = ({
  open,
  onOpenChange,
  workEntry,
  onEdit,
}) => {
  if (!workEntry) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours} ${wholeHours === 1 ? 'hour' : 'hours'}`;
    } else if (wholeHours === 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    } else {
      return `${wholeHours} ${
        wholeHours === 1 ? 'hour' : 'hours'
      } and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  };

  const handleEdit = () => {
    onEdit?.(workEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Work Entry Details</DialogTitle>
          <DialogDescription>
            View the complete details of this work entry.
          </DialogDescription>
        </DialogHeader>

        <Card className='mt-4'>
          <CardHeader>
            <CardTitle className='text-lg'>
              Work Entry - {formatDate(workEntry.startTime)}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Date */}
            <div>
              <Label className='text-sm font-medium text-muted-foreground'>
                Date
              </Label>
              <p className='text-sm font-medium'>
                {formatDate(workEntry.startTime)}
              </p>
            </div>

            {/* Hours */}
            <div>
              <Label className='text-sm font-medium text-muted-foreground'>
                Time Worked
              </Label>
              <p className='text-sm font-medium'>
                {formatHours(workEntry.duration)} ({workEntry.duration}h)
              </p>
            </div>

            {/* Description */}
            <div>
              <Label className='text-sm font-medium text-muted-foreground'>
                Description
              </Label>
              <p className='text-sm mt-1 whitespace-pre-wrap'>
                {workEntry.description}
              </p>
            </div>

            {/* Metadata */}
            <div className='border-t pt-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground'>
                <div>
                  <Label className='text-xs font-medium text-muted-foreground'>
                    Created
                  </Label>
                  <p>{formatDateTime(workEntry.createdAt)}</p>
                </div>
                <div>
                  <Label className='text-xs font-medium text-muted-foreground'>
                    Last Updated
                  </Label>
                  <p>{formatDateTime(workEntry.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex justify-between mt-6'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && <Button onClick={handleEdit}>Edit Entry</Button>}
        </div>

        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ViewWorkEntryModal;
