import type { Student, Transaction, Summary } from "@/types";

export const students: Student[] = [
  { id: '1', name: 'John Doe', grade: '10A', totalFeesDue: 5000, feesPaid: 5000, balance: 0 },
  { id: '2', name: 'Jane Smith', grade: '11B', totalFeesDue: 5500, feesPaid: 3000, balance: 2500 },
  { id: '3', name: 'Mike Johnson', grade: '9C', totalFeesDue: 4800, feesPaid: 4800, balance: 0 },
  { id: '4', name: 'Emily Davis', grade: '12A', totalFeesDue: 6000, feesPaid: 0, balance: 6000 },
  { id: '5', name: 'Chris Brown', grade: '10B', totalFeesDue: 5000, feesPaid: 2500, balance: 2500 },
  { id: '6', name: 'Sarah Wilson', grade: '11A', totalFeesDue: 5500, feesPaid: 5500, balance: 0 },
  { id: '7', name: 'David Miller', grade: '9A', totalFeesDue: 4800, feesPaid: 1000, balance: 3800 },
  { id: '8', name: 'Laura Garcia', grade: '12B', totalFeesDue: 6000, feesPaid: 6000, balance: 0 },
  { id: '9', name: 'James Rodriguez', grade: '10C', totalFeesDue: 5000, feesPaid: 5000, balance: 0 },
  { id: '10', name: 'Linda Martinez', grade: '11C', totalFeesDue: 5500, feesPaid: 4000, balance: 1500 },
];

export const transactions: Transaction[] = [
  { id: 't1', type: 'Income', amount: 5000, category: 'Tuition', date: '2024-01-15', description: 'John Doe - Tuition' },
  { id: 't2', type: 'Expense', amount: 1500, category: 'Salaries', date: '2024-01-20', description: 'Teacher Salaries - Jan' },
  { id: 't3', type: 'Income', amount: 3000, category: 'Tuition', date: '2024-02-10', description: 'Jane Smith - Partial Tuition' },
  { id: 't4', type: 'Expense', amount: 800, category: 'Utilities', date: '2024-02-25', description: 'Electricity Bill - Feb' },
  { id: 't5', type: 'Income', amount: 4800, category: 'Tuition', date: '2024-03-05', description: 'Mike Johnson - Tuition' },
  { id: 't6', type: 'Expense', amount: 2000, category: 'Maintenance', date: '2024-03-15', description: 'Campus Repairs' },
  { id: 't7', type: 'Income', amount: 2500, category: 'Uniforms', date: '2024-04-12', description: 'Chris Brown - Uniform Fees' },
  { id: 't8', type: 'Expense', amount: 1200, category: 'Supplies', date: '2024-04-20', description: 'Art & Science Supplies' },
  { id: 't9', type: 'Income', amount: 5500, category: 'Tuition', date: '2024-05-18', description: 'Sarah Wilson - Tuition' },
  { id: 't10', type: 'Expense', amount: 1600, category: 'Salaries', date: '2024-05-21', description: 'Teacher Salaries - May' },
  { id: 't11', type: 'Income', amount: 1000, category: 'Tuition', date: '2024-06-01', description: 'David Miller - Partial Tuition' },
  { id: 't12', type: 'Expense', amount: 950, category: 'Utilities', date: '2024-06-22', description: 'Water & Gas Bill - Jun' },
];

export const summary: Summary = {
  totalRevenue: transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0),
  totalExpenses: transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0),
};
