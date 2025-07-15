import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui';
import { Button } from '../ui/button';
import { formatDateTime, formatDuration } from '../../api/workEntries';
import type { WorkEntry } from '../../types/workEntry';

export interface DeleteWorkEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workEntry: WorkEntry | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteWorkEntryDialog: React.FC<DeleteWorkEntryDialogProps> = ({
  open,
  onOpenChange,
  workEntry,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!workEntry) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span className='text-red-600'>⚠️</span>
            Delete Work Entry
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The work entry will be permanently
            removed from your records.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='rounded-lg bg-gray-50 dark:bg-gray-800 p-4 space-y-2'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              <strong>Date:</strong> {formatDateTime(workEntry.startTime)}
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              <strong>Duration:</strong> {formatDuration(workEntry.duration)}
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              <strong>Description:</strong>
            </div>
            <div className='text-sm bg-white dark:bg-gray-700 p-2 rounded border max-h-20 overflow-y-auto'>
              {workEntry.description}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Work Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWorkEntryDialog;
