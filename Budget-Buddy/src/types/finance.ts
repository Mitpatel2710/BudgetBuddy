export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}