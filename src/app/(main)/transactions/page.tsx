'use client';

import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { transactionColumns } from '@/components/transactions/columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Transaction } from '@/types';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';

export default function TransactionsPage() {
  const firestore = useFirestore();

  const transactionsRef = useMemo(() => collection(firestore, 'transactions'), [firestore]);
  const incomeQuery = useMemo(() => query(transactionsRef, where('type', '==', 'Income')), [transactionsRef]);
  const expensesQuery = useMemo(() => query(transactionsRef, where('type', '==', 'Expense')), [transactionsRef]);

  const { data: allTransactions, isLoading: isLoadingAll } = useCollection<Transaction>(transactionsRef);
  const { data: incomeTransactions, isLoading: isLoadingIncome } = useCollection<Transaction>(incomeQuery);
  const { data: expenseTransactions, isLoading: isLoadingExpenses } = useCollection<Transaction>(expensesQuery);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <AddTransactionDialog type="Expense" />
          <AddTransactionDialog type="Income" />
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>A log of all income and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={allTransactions ?? []}
              filterColumn="description"
              isLoading={isLoadingAll}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="income">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>A log of all income transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={incomeTransactions ?? []}
              filterColumn="description"
              isLoading={isLoadingIncome}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="expenses">
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>A log of all expense transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={expenseTransactions ?? []}
              filterColumn="description"
              isLoading={isLoadingExpenses}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
