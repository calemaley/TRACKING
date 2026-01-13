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
import { EditStudentForm } from './edit-student-form';
import type { Student } from '@/types';

interface EditStudentDialogProps {
  student: Student;
  children: ReactNode;
}

export function EditStudentDialog({ student, children }: EditStudentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update the details for {student.name}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditStudentForm student={student} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
