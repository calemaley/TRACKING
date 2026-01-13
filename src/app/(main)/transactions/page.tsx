import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { transactionColumns } from '@/components/transactions/columns';
import { transactions } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransactionsPage() {
  const incomeTransactions = transactions.filter(t => t.type === 'Income');
  const expenseTransactions = transactions.filter(t => t.type === 'Expense');

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Expense
              </span>
            </Button>
          </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>A log of all income and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={transactionColumns} data={transactions} filterColumn="description" />
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
            <DataTable columns={transactionColumns} data={incomeTransactions} filterColumn="description" />
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
            <DataTable columns={transactionColumns} data={expenseTransactions} filterColumn="description" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
