import type { Transaction } from '../types/finance';

const STORAGE_KEY = 'transactions';

export function loadTransactions(): Transaction[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}