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
          <DialogTitle>Make Payment for {student.name}</DialogTitle>
          <DialogDescription>
            Record a new payment. The student's balance will be updated automatically.
          </DialogDescription>
        </DialogHeader>
        <MakePaymentForm student={student} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
