import React from 'react';
import { FileText, X } from 'lucide-react';
import { getLastTwelveMonths } from '../../utils/date';
import { generatePDF } from '../../utils/pdf';
import type { Transaction } from '../../types/finance';

interface MonthlyStatementsProps {
  transactions: Transaction[];
  onClose: () => void;
}

export function MonthlyStatements({ transactions, onClose }: MonthlyStatementsProps) {
  const months = getLastTwelveMonths();

  const handleMonthClick = async (date: Date) => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === date.getMonth() &&
             transactionDate.getFullYear() === date.getFullYear();
    });

    if (monthTransactions.length === 0) {
      alert('No transactions found for this month');
      return;
    }

    await generatePDF(monthTransactions, date);
    onClose();
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Statements</h3>

        <div className="grid grid-cols-2 gap-3">
          {months.map(({ month, year, date }) => (
            <button
              key={`${month}-${year}`}
              onClick={() => handleMonthClick(date)}
              className="flex items-center gap-2 p-3 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {month} {year}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}