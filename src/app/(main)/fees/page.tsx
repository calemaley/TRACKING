'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { feeItemColumns } from '@/components/fees/columns';
import { DataTable } from '@/components/data-table';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import type { FeeItem } from '@/types';
import { AddFeeItemDialog } from '@/components/fees/add-fee-item-dialog';

export default function FeesPage() {
  const firestore = useFirestore();
  const feeItemsRef = useMemo(() => collection(firestore, 'feeItems'), [firestore]);
  const { data: feeItems, isLoading } = useCollection<FeeItem>(feeItemsRef);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Fee Structures</CardTitle>
            <CardDescription>Manage billable items that can be added to invoices.</CardDescription>
          </div>
          <AddFeeItemDialog />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={feeItemColumns}
          data={feeItems ?? []}
          filterColumn="name"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
