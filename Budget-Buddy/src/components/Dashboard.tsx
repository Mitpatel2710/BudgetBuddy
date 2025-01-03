import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import type { Summary } from '../types/finance';
import type { Transaction } from '../types/finance';
import { useFormatMoney } from '../utils/format';
import toast from 'react-hot-toast';

interface DashboardProps {
  summary: Summary;
  transactions: Transaction[];
  onClearTransactions?: () => Promise<void>;
}

export function Dashboard({ summary, transactions, onClearTransactions }: DashboardProps) {
  const [isClearing, setIsClearing] = useState(false);
  const formatMoney = useFormatMoney();

  const handleClear = async () => {
    if (!onClearTransactions) return;

    if (window.confirm('Are you sure you want to clear all transactions? This action cannot be undone.')) {
      setIsClearing(true);
      try {
        await onClearTransactions();
        toast.success('All transactions have been cleared');
      } catch (error) {
        toast.error('Failed to clear transactions');
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Dashboard Overview</h2>
        {onClearTransactions && (
          <motion.button
            onClick={handleClear}
            disabled={isClearing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isClearing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Clear All
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {formatMoney(summary.totalIncome)}
              </p>
            </div>
            <motion.div
              className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {formatMoney(summary.totalExpenses)}
              </p>
            </div>
            <motion.div
              className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Savings</p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {formatMoney(summary.savings)}
              </p>
            </div>
            <motion.div
              className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}