'use client';

import { useState, type ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/types';
import type { StatementLineItem } from './student-statement';
import { cn } from '@/lib/utils';

interface DeleteStatementItemDialogProps {
  item: StatementLineItem;
  student: Student;
  children: ReactNode;
}

export function DeleteStatementItemDialog({ item, student, children }: DeleteStatementItemDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleDelete = async () => {
    try {
      await runTransaction(firestore, async (transaction) => {
        const studentRef = doc(firestore, 'students', student.id);
        const studentDoc = await transaction.get(studentRef);

        if (!studentDoc.exists()) {
          throw "Student document not found!";
        }

        if (item.type === 'invoice') {
          const invoiceRef = doc(firestore, 'invoices', item.id);
          const invoiceDoc = await transaction.get(invoiceRef);
          if (!invoiceDoc.exists()) {
              console.warn("Invoice document not found, it may have already been deleted.");
              return;
          }
          
          const invoiceAmount = invoiceDoc.data().totalAmount;
          const newTotalFeesDue = studentDoc.data().totalFeesDue - invoiceAmount;
          const newBalance = studentDoc.data().balance - invoiceAmount;
          
          transaction.update(studentRef, { totalFeesDue: newTotalFeesDue, balance: newBalance });
          transaction.delete(invoiceRef);

        } else if (item.type === 'payment') {
          const paymentRef = doc(firestore, 'transactions', item.id);
          const paymentDoc = await transaction.get(paymentRef);
          if (!paymentDoc.exists()) {
              console.warn("Payment transaction not found, it may have already been deleted.");
              return;
          }
          
          const paymentAmount = paymentDoc.data().amount;
          const newFeesPaid = studentDoc.data().feesPaid - paymentAmount;
          const newBalance = studentDoc.data().balance + paymentAmount;
          
          transaction.update(studentRef, { feesPaid: newFeesPaid, balance: newBalance });
          transaction.delete(paymentRef);
        }
      });

      toast({
        title: 'Item Deleted',
        description: `The statement item has been successfully deleted.`,
      });
      setOpen(false);

    } catch (error) {
      console.error('Error deleting statement item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild onClick={(e) => { e.stopPropagation(); }}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item "{item.description}" and update the student's balance accordingly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
