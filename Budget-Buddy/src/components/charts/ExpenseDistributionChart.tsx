import React from 'react';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import { CATEGORY_COLORS } from '../../constants/colors';
import type { Transaction } from '../../types/finance';

interface ExpenseDistributionChartProps {
  transactions: Transaction[];
}

export function ExpenseDistributionChart({ transactions }: ExpenseDistributionChartProps) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-3">
      {EXPENSE_CATEGORIES.map(category => {
        const categoryExpenses = expenses.filter(t => t.category === category);
        const amount = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        const color = CATEGORY_COLORS[category];

        return (
          <div key={category} className="flex items-center gap-2">
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-6">
              <div
                className="h-6 rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                  opacity: percentage > 0 ? 1 : 0.5
                }}
              />
            </div>
            <div className="flex items-center gap-2 min-w-[160px] text-sm text-gray-600 dark:text-gray-300">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              {category} ({percentage.toFixed(1)}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}