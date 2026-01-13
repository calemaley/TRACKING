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
import type { Transaction } from '@/types';
import { EditTransactionDialog } from './edit-transaction-dialog';
import { DeleteTransactionDialog } from './delete-transaction-dialog';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
};

export const transactionColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            return new Intl.DateTimeFormat('en-US').format(date);
        }
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.original.type;
            const variant: "default" | "outline" = type === 'Income' ? 'default' : 'outline';
            return <Badge variant={variant} className={type === 'Income' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>{type}</Badge>;
        }
    },
    {
        accessorKey: 'amount',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('amount'))
          const type = row.original.type;
          const formatted = formatCurrency(amount);
     
          return <div className={`text-right font-medium ${type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{type === 'Income' ? '+' : '-'} {formatted}</div>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
          const transaction = row.original;
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
                <EditTransactionDialog transaction={transaction}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Transaction</DropdownMenuItem>
                </EditTransactionDialog>
                <DropdownMenuSeparator />
                <DeleteTransactionDialog transaction={transaction}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    Delete Transaction
                  </DropdownMenuItem>
                </DeleteTransactionDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
    },
];
