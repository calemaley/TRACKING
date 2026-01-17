'use client';

import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { doc, runTransaction, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/types';
import { usePaystackPayment } from 'react-paystack';
import { Banknote, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


interface MakePaymentFormProps {
  student: Student;
  setOpen: (open: boolean) => void;
}

export function MakePaymentForm({ student, setOpen }: MakePaymentFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

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
        // The amount paid is the balance at the time of payment initiation
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
    email: student.email || 'guest@example.com',
    amount: currentBalance * 100, // Amount in kobo/cents
    publicKey,
  };

  const initializePayment = usePaystackPayment(config);

  const isConfigured = !!publicKey;
  const canPay = currentBalance > 0 && !!student.email && isConfigured;

  let errorCondition = null;
  if (!isConfigured) {
    errorCondition = (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Configuration Error</AlertTitle>
        <AlertDescription>
          Paystack is not configured. The public key is missing.
        </AlertDescription>
      </Alert>
    );
  } else if (currentBalance <= 0) {
    errorCondition = (
        <Alert>
          <AlertTitle>No Balance Due</AlertTitle>
          <AlertDescription>
            This student has no outstanding balance to be paid.
          </AlertDescription>
        </Alert>
    );
  } else if (!student.email) {
    errorCondition = (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Email Missing</AlertTitle>
        <AlertDescription>
          A contact email is required to make an online payment for this student.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
        <div className='p-4 bg-muted rounded-md'>
            <p className='text-sm text-muted-foreground'>Current Balance</p>
            <p className='text-2xl font-bold'>{formatCurrency(currentBalance)}</p>
        </div>
        
        {errorCondition}
        
        <div className="flex justify-end gap-2 pt-4">
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
