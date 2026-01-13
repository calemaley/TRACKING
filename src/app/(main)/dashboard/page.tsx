import { StatCards } from '@/components/dashboard/stat-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { PendingPayments } from '@/components/dashboard/pending-payments';
import { AiSummary } from '@/components/dashboard/ai-summary';
import { summary, transactions, students } from '@/lib/mock-data';

export default function DashboardPage() {
  const studentsWithBalance = students.filter(s => s.balance > 0);

  return (
    <div className="grid gap-6">
      <StatCards data={summary} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={transactions} />
        </div>
        <div className="lg:col-span-1">
          <AiSummary />
        </div>
      </div>
      <PendingPayments data={studentsWithBalance} />
    </div>
  );
}
