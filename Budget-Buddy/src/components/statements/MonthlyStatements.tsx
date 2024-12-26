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
    <div className="relative p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Statements</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {months.map(({ month, year, date }) => (
          <button
            key={`${month}-${year}`}
            onClick={() => handleMonthClick(date)}
            className="flex items-center gap-2 p-3 text-left text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <span>
              {month} {year}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}