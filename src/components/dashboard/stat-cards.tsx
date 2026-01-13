'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Landmark } from 'lucide-react';
import type { Summary } from '@/types';

interface StatCardsProps {
    data: Summary;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

export function StatCards({ data }: StatCardsProps) {
  const { totalRevenue, totalExpenses } = data;
  const netProfit = totalRevenue - totalExpenses;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-red-500',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(netProfit),
      icon: DollarSign,
      color: netProfit >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
