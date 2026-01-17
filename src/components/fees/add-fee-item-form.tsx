'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const feeItemFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  amount: z.coerce.number().min(0, {
    message: 'Amount must be a positive number.',
  }),
  description: z.string().optional(),
});

type FeeItemFormValues = z.infer<typeof feeItemFormSchema>;

interface AddFeeItemFormProps {
  setOpen: (open: boolean) => void;
}

export function AddFeeItemForm({ setOpen }: AddFeeItemFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<FeeItemFormValues>({
    resolver: zodResolver(feeItemFormSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
    },
  });

  const onSubmit = async (data: FeeItemFormValues) => {
    try {
      const feeItemsRef = collection(firestore, 'feeItems');
      const newDocRef = doc(feeItemsRef);
      const feeItemData = {
        ...data,
        id: newDocRef.id,
      };
      await addDocumentNonBlocking(feeItemsRef, feeItemData);

      toast({
        title: 'Fee Item Added',
        description: `${data.name} has been successfully added.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding fee item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add fee item. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Term 1 Tuition" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (KES)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the fee item..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save Item</Button>
        </div>
      </form>
    </Form>
  );
}
