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
import { EditTransactionForm } from './edit-transaction-form';
import type { Transaction } from '@/types';

interface EditTransactionDialogProps {
  transaction: Transaction;
  children: ReactNode;
}

export function EditTransactionDialog({ transaction, children }: EditTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the details for this transaction. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditTransactionForm transaction={transaction} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
