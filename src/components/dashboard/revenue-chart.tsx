'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/types';
import { useMemo } from 'react';

interface RevenueChartProps {
  data: Transaction[];
}

const formatCurrencyForAxis = (value: number) => `$${(value / 1000).toFixed(0)}k`;

export function RevenueChart({ data }: RevenueChartProps) {
    const chartData = useMemo(() => {
        const monthlyData: { [key: string]: { month: string; income: number; expenses: number } } = {};
        
        data.forEach(transaction => {
            const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { month, income: 0, expenses: 0 };
            }
            if (transaction.type === 'Income') {
                monthlyData[month].income += transaction.amount;
            } else {
                monthlyData[month].expenses += transaction.amount;
            }
        });

        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        return monthOrder.map(month => monthlyData[month] || { month, income: 0, expenses: 0 });

    }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Expenses Overview</CardTitle>
        <CardDescription>A summary of monthly financial activity.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrencyForAxis}
            />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
                formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
            />
            <Legend />
            <Bar dataKey="income" name="Income" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
