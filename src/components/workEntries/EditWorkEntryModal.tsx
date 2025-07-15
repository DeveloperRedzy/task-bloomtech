import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui';
import EditWorkEntryForm from './EditWorkEntryForm';
import type { WorkEntry } from '../../types/workEntry';

export interface EditWorkEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workEntry: WorkEntry | null;
  onSuccess?: (workEntry: WorkEntry) => void;
}

const EditWorkEntryModal: React.FC<EditWorkEntryModalProps> = ({
  open,
  onOpenChange,
  workEntry,
  onSuccess,
}) => {
  const handleSuccess = (updatedWorkEntry: WorkEntry) => {
    onSuccess?.(updatedWorkEntry);
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
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Work Entry</DialogTitle>
          <DialogDescription>
            Update your work entry details. Changes will be saved automatically.
          </DialogDescription>
        </DialogHeader>

        <EditWorkEntryForm
          workEntry={workEntry}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          className='mt-4'
        />

        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkEntryModal;
