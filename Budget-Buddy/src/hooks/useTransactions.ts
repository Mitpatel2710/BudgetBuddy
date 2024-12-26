import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Transaction, Summary } from '../types/finance';
import { calculateSummary } from '../utils/calculations';
import { useAuth } from './useAuth';
import { isCurrentMonth } from '../utils/date';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0
  });

  useEffect(() => {
    if (!user || !supabase) return;

    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        setTransactions(data || []);
        setSummary(calculateSummary(data || []));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [user]);

  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            ...newTransaction,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      setSummary(calculateSummary([data, ...transactions]));
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const clearTransactions = async () => {
    if (!user || !supabase) return;

    try {
      // Get current month's transactions
      const currentMonthTransactions = transactions.filter(t => isCurrentMonth(t.date));
      if (currentMonthTransactions.length === 0) return;

      // Delete current month's transactions
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', currentMonthTransactions.map(t => t.id));

      if (error) throw error;

      // Update local state
      const remainingTransactions = transactions.filter(t => !isCurrentMonth(t.date));
      setTransactions(remainingTransactions);
      setSummary(calculateSummary(remainingTransactions));
    } catch (error) {
      console.error('Error clearing transactions:', error);
      throw error;
    }
  };

  return {
    transactions,
    addTransaction,
    clearTransactions,
    summary,
    loading
  };
}