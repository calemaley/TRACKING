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
import { MakePaymentForm } from './make-payment-form';
import type { Student } from '@/types';

interface MakePaymentDialogProps {
  student: Student;
  children: ReactNode;
}

export function MakePaymentDialog({ student, children }: MakePaymentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pay Balance for {student.name}</DialogTitle>
          <DialogDescription>
            Make a payment to clear the student's outstanding balance.
          </DialogDescription>
        </DialogHeader>
        <MakePaymentForm student={student} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
