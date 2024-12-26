import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import type { Transaction } from '../../types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface TransactionsPieChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
}

const COLORS = [
  '#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981',
  '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#F97316',
  '#14B8A6', '#06B6D4'
];

export function TransactionsPieChart({ transactions, type }: TransactionsPieChartProps) {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  const data = categories.map(category => {
    return transactions
      .filter(t => t.type === type && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const chartData = {
    labels: categories,
    datasets: [
      {
        data,
        backgroundColor: COLORS,
        borderColor: COLORS.map(color => color + '88'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
}