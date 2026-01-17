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
import { GenerateInvoiceForm } from './generate-invoice-form';
import type { Student } from '@/types';

interface GenerateInvoiceDialogProps {
  student: Student;
  children: ReactNode;
}

export function GenerateInvoiceDialog({ student, children }: GenerateInvoiceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Invoice for {student.name}</DialogTitle>
          <DialogDescription>
            Select the items to add to the invoice. This will update the student's total balance.
          </DialogDescription>
        </DialogHeader>
        <GenerateInvoiceForm student={student} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
