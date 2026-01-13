'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/types';

const paymentFormSchema = z.object({
  paymentAmount: z.coerce.number().positive({
    message: 'Payment amount must be a positive number.',
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface MakePaymentFormProps {
  student: Student;
  setOpen: (open: boolean) => void;
}

export function MakePaymentForm({ student, setOpen }: MakePaymentFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentAmount: '' as any,
    },
  });
  
  const currentBalance = student.balance;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(amount);


  const onSubmit = async (data: PaymentFormValues) => {
    try {
      const studentRef = doc(firestore, 'students', student.id);
      
      await runTransaction(firestore, async (transaction) => {
        const studentDoc = await transaction.get(studentRef);
        if (!studentDoc.exists()) {
          throw "Document does not exist!";
        }

        const currentFeesPaid = studentDoc.data().feesPaid || 0;
        const newFeesPaid = currentFeesPaid + data.paymentAmount;
        const newBalance = studentDoc.data().totalFeesDue - newFeesPaid;

        transaction.update(studentRef, { 
            feesPaid: newFeesPaid,
            balance: newBalance
        });
      });

      toast({
        title: 'Payment Successful',
        description: `Payment of ${formatCurrency(data.paymentAmount)} for ${student.name} has been recorded.`,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error making payment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to record payment. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className='p-4 bg-muted rounded-md'>
            <p className='text-sm text-muted-foreground'>Current Balance</p>
            <p className='text-2xl font-bold'>{formatCurrency(currentBalance)}</p>
        </div>
        <FormField
          control={form.control}
          name="paymentAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Payment Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Record Payment</Button>
        </div>
      </form>
    </Form>
  );
}
