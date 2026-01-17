'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Student, Transaction, Invoice } from '@/types';
import { StudentStatement } from '@/components/students/student-statement';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function StudentStatementPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const firestore = useFirestore();

  const studentRef = useMemo(() => doc(firestore, 'students', studentId), [firestore, studentId]);
  const { data: student, isLoading: isLoadingStudent } = useDoc<Student>(studentRef);

  const invoicesRef = useMemo(() => query(collection(firestore, 'invoices'), where('studentId', '==', studentId)), [firestore, studentId]);
  const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesRef);

  const transactionsRef = useMemo(() => query(collection(firestore, 'transactions'), where('studentId', '==', studentId)), [firestore, studentId]);
  const { data: transactions, isLoading: isLoadingTransactions } = useCollection<Transaction>(transactionsRef);

  const isLoading = isLoadingStudent || isLoadingInvoices || isLoadingTransactions;

  return (
    <Card>
      <CardHeader>
        {isLoading || !student ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : (
          <StudentStatement.Header student={student} />
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <StudentStatement
            student={student!}
            invoices={invoices ?? []}
            transactions={transactions ?? []}
          />
        )}
      </CardContent>
    </Card>
  );
}
