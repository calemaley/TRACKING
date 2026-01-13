"use client"
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { studentColumns } from '@/components/students/columns';
import { DataTable } from '@/components/data-table';
import { students } from '@/lib/mock-data';

export default function StudentsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage student fees and payments.</CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={studentColumns} data={students} filterColumn="name" />
      </CardContent>
    </Card>
  );
}
