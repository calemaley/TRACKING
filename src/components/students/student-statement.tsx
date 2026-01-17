'use client';

import { useMemo } from 'react';
import type { Student, Invoice, Transaction } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CardDescription, CardTitle } from '@/components/ui/card';

type StatementLineItem = {
  date: string;
  description: string;
  charge: number;
  payment: number;
};

interface StudentStatementProps {
  student: Student;
  invoices: Invoice[];
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function StudentStatementHeader({ student }: { student: Student }) {
    return (
        <div>
            <CardTitle className="text-2xl">Fee Statement for {student.name}</CardTitle>
            <CardDescription className="mt-1">
                Grade: {student.grade} | Current Balance: <span className="font-semibold text-primary">{formatCurrency(student.balance)}</span>
            </CardDescription>
        </div>
    );
}


export function StudentStatement({ student, invoices, transactions }: StudentStatementProps) {
  const statementItems = useMemo(() => {
    const items: StatementLineItem[] = [];

    invoices.forEach(invoice => {
      items.push({
        date: invoice.date,
        description: `Invoice #${invoice.id.substring(0, 6)} (${invoice.items.map(i => i.name).join(', ')})`,
        charge: invoice.totalAmount,
        payment: 0,
      });
    });

    transactions
      .filter(t => t.type === 'Income') // Only show payments
      .forEach(transaction => {
        items.push({
          date: transaction.date,
          description: transaction.description,
          charge: 0,
          payment: transaction.amount,
        });
      });

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [invoices, transactions]);

  let runningBalance = 0;

  return (
    <div className="rounded-md border">
        <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Charges (KES)</TableHead>
                <TableHead className="text-right">Payments (KES)</TableHead>
                <TableHead className="text-right">Balance (KES)</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {statementItems.length === 0 ? (
            <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                No financial activity recorded for this student yet.
                </TableCell>
            </TableRow>
            ) : (
            statementItems.map((item, index) => {
                runningBalance += item.charge - item.payment;
                return (
                <TableRow key={index}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                        {item.charge > 0 ? formatCurrency(item.charge) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                        {item.payment > 0 ? formatCurrency(item.payment) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(runningBalance)}</TableCell>
                </TableRow>
                );
            })
            )}
            <TableRow className="bg-muted/50 font-bold">
              <TableCell colSpan={4} className="text-right">Final Balance</TableCell>
              <TableCell className="text-right">{formatCurrency(student.balance)}</TableCell>
            </TableRow>
        </TableBody>
        </Table>
    </div>
  );
}

StudentStatement.Header = StudentStatementHeader;
