'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddFeeItemForm } from './add-fee-item-form';

export function AddFeeItemDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Fee Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Fee Item</DialogTitle>
          <DialogDescription>
            Enter the details for a new billable item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <AddFeeItemForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
