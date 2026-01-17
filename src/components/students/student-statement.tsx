'use client';

import { useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Student, Invoice, Transaction } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteStatementItemDialog } from './delete-statement-item-dialog';

export type StatementLineItem = {
  id: string;
  type: 'invoice' | 'payment';
  date: string;
  description: string;
  charge: number;
  payment: number;
};

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

interface StudentStatementProps {
  student: Student;
  invoices: Invoice[];
  transactions: Transaction[];
}

export function StudentStatement({ student, invoices, transactions }: StudentStatementProps) {
  const statementItems = useMemo(() => {
    const items: StatementLineItem[] = [];

    invoices.forEach(invoice => {
      items.push({
        id: invoice.id,
        type: 'invoice',
        date: invoice.date,
        description: `Invoice #${invoice.id.substring(0, 6)} (${invoice.items.map(i => i.name).join(', ')})`,
        charge: invoice.totalAmount,
        payment: 0,
      });
    });

    transactions
      .filter(t => t.type === 'Income' && t.studentId === student.id)
      .forEach(transaction => {
        items.push({
          id: transaction.id,
          type: 'payment',
          date: transaction.date,
          description: transaction.description,
          charge: 0,
          payment: transaction.amount,
        });
      });

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [invoices, transactions, student.id]);

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const autoTable = doc.autoTable;

    doc.setFontSize(20);
    doc.text(`Fee Statement for ${student.name}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Grade: ${student.grade}`, 14, 30);
    doc.text(`Current Balance: ${formatCurrency(student.balance)}`, 14, 36);

    const tableColumn = ["Date", "Description", "Charges (KES)", "Payments (KES)", "Balance (KES)"];
    const tableRows: any[] = [];

    let runningBalance = 0;
    statementItems.forEach(item => {
        runningBalance += item.charge - item.payment;
        const rowData = [
            formatDate(item.date),
            item.description,
            item.charge > 0 ? formatCurrency(item.charge) : '-',
            item.payment > 0 ? formatCurrency(item.payment) : '-',
            formatCurrency(runningBalance)
        ];
        tableRows.push(rowData);
    });
    
    autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94] },
        foot: [['', '', '', 'Final Balance', formatCurrency(student.balance)]],
        footStyles: { fillColor: [244, 244, 245], textColor: [0,0,0], fontStyle: 'bold' },
    });
    
    doc.save(`statement-${student.id.substring(0,6)}.pdf`);
};

  let runningBalance = 0;

  return (
    <>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-2xl">Fee Statement for {student.name}</CardTitle>
            <CardDescription className="mt-1">
              Grade: {student.grade} | Current Balance: <span className="font-semibold text-primary">{formatCurrency(student.balance)}</span>
            </CardDescription>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Charges (KES)</TableHead>
                    <TableHead className="text-right">Payments (KES)</TableHead>
                    <TableHead className="text-right">Balance (KES)</TableHead>
                    <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {statementItems.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DeleteStatementItemDialog item={item} student={student}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DeleteStatementItemDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    );
                })
                )}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={5} className="text-right">Final Balance</TableCell>
                  <TableCell className="text-right">{formatCurrency(student.balance)}</TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </>
  );
}
