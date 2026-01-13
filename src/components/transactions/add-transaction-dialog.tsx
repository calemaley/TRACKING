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
import { AddTransactionForm } from './add-transaction-form';

interface AddTransactionDialogProps {
  type: 'Income' | 'Expense';
}

export function AddTransactionDialog({ type }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add {type}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {type}</DialogTitle>
          <DialogDescription>
            Enter the details of the new {type.toLowerCase()} below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <AddTransactionForm setOpen={setOpen} type={type} />
      </DialogContent>
    </Dialog>
  );
}
