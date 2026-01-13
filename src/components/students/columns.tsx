'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Student } from '@/types';
import { EditStudentDialog } from './edit-student-dialog';
import { MakePaymentDialog } from './make-payment-dialog';
import { DeleteStudentDialog } from './delete-student-dialog';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
};

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: 'grade',
    header: 'Grade',
  },
  {
    accessorKey: 'totalFeesDue',
    header: () => <div className="text-right">Total Fees</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{formatCurrency(row.original.totalFeesDue)}</div>
    }
  },
  {
    accessorKey: 'feesPaid',
    header: () => <div className="text-right">Fees Paid</div>,
    cell: ({ row }) => {
        return <div className="text-right font-medium">{formatCurrency(row.original.feesPaid)}</div>
    }
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
        const balance = row.original.balance;
        return <div className="text-right font-medium">{formatCurrency(balance)}</div>
    }
  },
  {
    accessorKey: 'status',
    header: 'Payment Status',
    cell: ({ row }) => {
      const balance = row.original.balance;
      const status: 'Paid' | 'Partial' | 'Unpaid' = balance <= 0 ? 'Paid' : (row.original.feesPaid > 0 ? 'Partial' : 'Unpaid');
      const variant: "default" | "secondary" | "destructive" | "outline" | null | undefined = status === 'Paid' ? 'default' : status === 'Partial' ? 'secondary' : 'destructive';

      return <Badge variant={variant} className={status === 'Paid' ? 'bg-green-500' : ''}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <MakePaymentDialog student={student}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Make Payment</DropdownMenuItem>
            </MakePaymentDialog>
            <EditStudentDialog student={student}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Student</DropdownMenuItem>
            </EditStudentDialog>
            <DropdownMenuSeparator />
            <DeleteStudentDialog studentId={student.id} studentName={student.name}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                Delete Student
              </DropdownMenuItem>
            </DeleteStudentDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
