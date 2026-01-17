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
import type { FeeItem } from '@/types';
import { EditFeeItemDialog } from './edit-fee-item-dialog';
import { DeleteFeeItemDialog } from './delete-fee-item-dialog';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
};

export const feeItemColumns: ColumnDef<FeeItem>[] = [
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
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{formatCurrency(row.original.amount)}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const feeItem = row.original;
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
            <EditFeeItemDialog feeItem={feeItem}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Item</DropdownMenuItem>
            </EditFeeItemDialog>
            <DropdownMenuSeparator />
            <DeleteFeeItemDialog feeItemId={feeItem.id} feeItemName={feeItem.name}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                Delete Item
              </DropdownMenuItem>
            </DeleteFeeItemDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
