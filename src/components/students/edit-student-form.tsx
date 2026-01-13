'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/types';

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

interface EditStudentFormProps {
  student: Student;
  setOpen: (open: boolean) => void;
}

export function EditStudentForm({ student, setOpen }: EditStudentFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: student.name,
      grade: student.grade,
      totalFeesDue: student.totalFeesDue,
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      const studentRef = doc(firestore, 'students', student.id);
      const updatedBalance = data.totalFeesDue - student.feesPaid;
      
      const updatedData = {
        ...data,
        balance: updatedBalance,
      };

      await updateDocumentNonBlocking(studentRef, updatedData);

      toast({
        title: 'Student Updated',
        description: `${data.name}'s details have been successfully updated.`,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update student. Please try again.',
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
                <Input type="number" placeholder="50000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
