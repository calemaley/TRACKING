'use client';

import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { doc, runTransaction, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/types';
import { usePaystackPayment } from 'react-paystack';
import { Banknote } from 'lucide-react';

interface MakePaymentFormProps {
  student: Student;
  setOpen: (open: boolean) => void;
}

export function MakePaymentForm({ student, setOpen }: MakePaymentFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const currentBalance = student.balance;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(amount);

  const handlePaymentSuccess = async () => {
    try {
      const studentRef = doc(firestore, 'students', student.id);
      
      await runTransaction(firestore, async (transaction) => {
        const studentDoc = await transaction.get(studentRef);
        if (!studentDoc.exists()) {
          throw "Document does not exist!";
        }

        const currentFeesPaid = studentDoc.data().feesPaid || 0;
        const newFeesPaid = currentFeesPaid + currentBalance;
        const newBalance = studentDoc.data().totalFeesDue - newFeesPaid;

        transaction.update(studentRef, { 
            feesPaid: newFeesPaid,
            balance: newBalance
        });

        const newTransactionRef = doc(collection(firestore, 'transactions'));
        transaction.set(newTransactionRef, {
            id: newTransactionRef.id,
            type: 'Income',
            amount: currentBalance,
            category: 'Fee Payment (Paystack)',
            date: new Date().toISOString(),
            description: `Online payment from ${student.name}`,
            studentId: student.id,
        });
      });

      toast({
        title: 'Payment Successful',
        description: `Payment of ${formatCurrency(currentBalance)} for ${student.name} has been recorded.`,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to record payment after confirmation. Please contact support.',
      });
    }
  };

  const handlePaymentClose = () => {
    toast({
      variant: 'default',
      title: 'Payment Modal Closed',
      description: 'The payment process was not completed.',
    });
  };

  const config = {
    reference: `${student.id}_${new Date().getTime()}`,
    email: student.email || 'guest@example.com', // Fallback email
    amount: currentBalance * 100, // Amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePayment = usePaystackPayment(config);

  const canPay = currentBalance > 0 && !!student.email;

  return (
    <div className="space-y-8">
        <div className='p-4 bg-muted rounded-md'>
            <p className='text-sm text-muted-foreground'>Current Balance</p>
            <p className='text-2xl font-bold'>{formatCurrency(currentBalance)}</p>
        </div>
        
        {!student.email && currentBalance > 0 && (
          <div className="text-sm text-destructive">
            Please add a contact email for this student to enable online payments.
          </div>
        )}
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
                onClick={() => {
                    if(canPay) {
                        initializePayment({ onSuccess: handlePaymentSuccess, onClose: handlePaymentClose });
                    }
                }}
                disabled={!canPay}
            >
                <Banknote className="mr-2 h-4 w-4" />
                Pay with Paystack
            </Button>
        </div>
    </div>
  );
}
