'use client';

import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EditFeeItemForm } from './edit-fee-item-form';
import type { FeeItem } from '@/types';

interface EditFeeItemDialogProps {
  feeItem: FeeItem;
  children: ReactNode;
}

export function EditFeeItemDialog({ feeItem, children }: EditFeeItemDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Fee Item</DialogTitle>
          <DialogDescription>
            Update the details for {feeItem.name}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditFeeItemForm feeItem={feeItem} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
