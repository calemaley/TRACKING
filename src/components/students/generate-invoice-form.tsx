'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCollection, useFirestore } from '@/firebase';
import { collection, doc, runTransaction } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Student, FeeItem, Invoice, InvoiceItem } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { useMemo } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const invoiceFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});
type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface GenerateInvoiceFormProps {
  student: Student;
  setOpen: (open: boolean) => void;
}

export function GenerateInvoiceForm({ student, setOpen }: GenerateInvoiceFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const feeItemsRef = useMemo(() => collection(firestore, 'feeItems'), [firestore]);
  const { data: feeItems, isLoading } = useCollection<FeeItem>(feeItemsRef);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      items: [],
    },
  });
  
  const selectedItemIds = form.watch('items');
  const totalAmount = useMemo(() => {
    if (!feeItems) return 0;
    return selectedItemIds.reduce((acc, itemId) => {
        const item = feeItems.find(fi => fi.id === itemId);
        return acc + (item?.amount || 0);
    }, 0);
  }, [selectedItemIds, feeItems]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(amount);

  const onSubmit = async (data: InvoiceFormValues) => {
    if (!feeItems) return;

    const invoiceItems: InvoiceItem[] = data.items.map(itemId => {
        const item = feeItems.find(fi => fi.id === itemId)!;
        return {
            feeItemId: item.id,
            name: item.name,
            amount: item.amount,
        };
    });
    
    const invoiceTotal = invoiceItems.reduce((acc, item) => acc + item.amount, 0);

    try {
        const studentRef = doc(firestore, 'students', student.id);
        const invoiceRef = doc(collection(firestore, 'invoices'));

        await runTransaction(firestore, async (transaction) => {
            const studentDoc = await transaction.get(studentRef);
            if (!studentDoc.exists()) {
                throw "Student document does not exist!";
            }

            const newTotalFeesDue = studentDoc.data().totalFeesDue + invoiceTotal;
            const newBalance = studentDoc.data().balance + invoiceTotal;
            transaction.update(studentRef, {
                totalFeesDue: newTotalFeesDue,
                balance: newBalance,
            });

            const newInvoice: Invoice = {
                id: invoiceRef.id,
                studentId: student.id,
                date: new Date().toISOString(),
                items: invoiceItems,
                totalAmount: invoiceTotal,
                status: 'unpaid',
            };
            transaction.set(invoiceRef, newInvoice);
        });

        toast({
            title: 'Invoice Generated',
            description: `An invoice for ${formatCurrency(invoiceTotal)} has been added to ${student.name}'s account.`,
        });
        setOpen(false);

    } catch (error) {
        console.error('Error generating invoice:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to generate invoice. Please try again.',
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Available Fee Items</FormLabel>
              </div>
              <ScrollArea className="h-40 w-full rounded-md border">
                <div className="p-4">
                {isLoading && (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                )}
                {feeItems?.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0 mb-4"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal flex justify-between w-full cursor-pointer">
                            <span>{item.name}</span>
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                {!isLoading && feeItems?.length === 0 && <p className="text-sm text-muted-foreground text-center">No fee items found. Add some in the 'Fee Structures' page.</p>}
                </div>
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='p-4 bg-muted rounded-md'>
            <p className='text-sm text-muted-foreground'>Invoice Total</p>
            <p className='text-2xl font-bold'>{formatCurrency(totalAmount)}</p>
        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || (selectedItemIds && selectedItemIds.length === 0)}>Generate Invoice</Button>
        </div>
      </form>
    </Form>
  );
}
