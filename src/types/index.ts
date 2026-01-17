export type Student = {
    id: string;
    name: string;
    email?: string;
    grade: string;
    totalFeesDue: number;
    feesPaid: number;
    balance: number;
  };
  
  export type Transaction = {
    id: string;
    type: 'Income' | 'Expense';
    amount: number;
    category: string;
    date: string;
    description: string;
    studentId?: string;
  };
  
  export type Summary = {
    totalRevenue: number;
    totalExpenses: number;
  };

  export type FeeItem = {
    id: string;
    name: string;
    amount: number;
    description?: string;
};

export type InvoiceItem = {
  feeItemId: string;
  name: string;
  amount: number;
}

export type Invoice = {
  id: string;
  studentId: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'unpaid' | 'paid' | 'partial';
};
  
