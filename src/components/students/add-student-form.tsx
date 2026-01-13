'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const studentFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  grade: z.string().min(1, {
    message: 'Grade is required.',
  }),
  totalFeesDue: z.coerce.number().min(0, {
    message: 'Total fees due must be a positive number.',
  }),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface AddStudentFormProps {
  setOpen: (open: boolean) => void;
}

export function AddStudentForm({ setOpen }: AddStudentFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      grade: '',
      totalFeesDue: 0,
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      const studentsRef = collection(firestore, 'students');
      const newDocRef = doc(studentsRef);
      const studentData = {
        ...data,
        id: newDocRef.id,
        feesPaid: 0,
        balance: data.totalFeesDue,
      };
      await addDocumentNonBlocking(studentsRef, studentData);

      toast({
        title: 'Student Added',
        description: `${data.name} has been successfully added.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add student. Please try again.',
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
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <FormControl>
                <Input placeholder="10A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalFeesDue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Fees Due</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save Student</Button>
        </div>
      </form>
    </Form>
  );
}
