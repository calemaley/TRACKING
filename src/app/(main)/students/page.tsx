'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { studentColumns } from '@/components/students/columns';
import { DataTable } from '@/components/data-table';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Student } from '@/types';
import { AddStudentDialog } from '@/components/students/add-student-dialog';

export default function StudentsPage() {
  const firestore = useFirestore();
  const studentsRef = useMemo(() => collection(firestore, 'students'), [firestore]);
  const { data: students, isLoading } = useCollection<Student>(studentsRef);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage student fees and payments.</CardDescription>
          </div>
          <AddStudentDialog />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={studentColumns}
          data={students ?? []}
          filterColumn="name"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
