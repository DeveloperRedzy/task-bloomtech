import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui';
import CreateWorkEntryForm from './CreateWorkEntryForm';
import type { WorkEntry } from '../../types/workEntry';

export interface CreateWorkEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (workEntry: WorkEntry) => void;
}

const CreateWorkEntryModal: React.FC<CreateWorkEntryModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const handleSuccess = (workEntry: WorkEntry) => {
    onSuccess?.(workEntry);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create Work Entry</DialogTitle>
          <DialogDescription>
            Add a new work entry to track your time. Make sure to enter accurate
            information.
          </DialogDescription>
        </DialogHeader>

        <CreateWorkEntryForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          className='mt-4'
        />

        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkEntryModal;
