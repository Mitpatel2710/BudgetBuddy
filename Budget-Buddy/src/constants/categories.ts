export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Insurance',
  'Personal Care',
  'Other Expenses'
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Business',
  'Gifts',
  'Other Income'
] as const;

export const REFUND_CATEGORIES = [
  'Shopping Return',
  'Service Refund',
  'Bill Adjustment',
  'Insurance Claim',
  'Travel Refund',
  'Other Refund'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type RefundCategory = typeof REFUND_CATEGORIES[number];
export type TransactionType = 'income' | 'expense' | 'refund';