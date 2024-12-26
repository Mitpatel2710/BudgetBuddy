import type { Transaction, Summary } from '../types/finance';

export function calculateSummary(transactions: Transaction[]): Summary {
  return transactions.reduce(
    (acc, transaction) => {
      switch (transaction.type) {
        case 'income':
          acc.totalIncome += transaction.amount;
          break;
        case 'expense':
          acc.totalExpenses += transaction.amount;
          break;
        case 'refund':
          // Refund reduces total expenses and increases savings
          acc.totalExpenses -= transaction.amount;
          break;
      }
      // Net savings is income minus expenses (after refunds)
      acc.savings = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, savings: 0 }
  );
}