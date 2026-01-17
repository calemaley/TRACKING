'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Student, Transaction, Summary } from '@/types';
import { StatCards } from '@/components/dashboard/stat-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { PendingPayments } from '@/components/dashboard/pending-payments';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const firestore = useFirestore();

  const transactionsRef = useMemo(() => collection(firestore, 'transactions'), [firestore]);
  const { data: transactions, isLoading: isLoadingTransactions } = useCollection<Transaction>(transactionsRef);

  const studentsRef = useMemo(() => collection(firestore, 'students'), [firestore]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsRef);

  const summary: Summary = useMemo(() => {
    if (!transactions) {
      return { totalRevenue: 0, totalExpenses: 0 };
    }
    const totalRevenue = transactions
      .filter(t => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { totalRevenue, totalExpenses };
  }, [transactions]);

  const studentsWithBalance = useMemo(() => {
    if (!students) {
      return [];
    }
    return students.filter(s => s.balance > 0);
  }, [students]);
  
  const isLoading = isLoadingTransactions || isLoadingStudents;

  return (
    <div className="grid gap-6">
      {isLoading ? (
         <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-[109px] w-full" />
            <Skeleton className="h-[109px] w-full" />
            <Skeleton className="h-[109px] w-full" />
         </div>
      ) : (
        <StatCards data={summary} />
      )}
      
      {isLoading ? <Skeleton className="h-[438px] w-full" /> : <RevenueChart data={transactions ?? []} />}

      {isLoading ? <Skeleton className="h-[348px] w-full" /> : <PendingPayments data={studentsWithBalance} />}
    </div>
  );
}
