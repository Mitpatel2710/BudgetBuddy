import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { Transaction } from '../../types/finance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SavingsTrendChartProps {
  transactions: Transaction[];
}

export function SavingsTrendChart({ transactions }: SavingsTrendChartProps) {
  const monthlyData = React.useMemo(() => {
    const last6Months = new Array(6).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        date
      };
    }).reverse();

    return last6Months.map(({ month, year, date }) => {
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        label: `${month} ${year}`,
        savings: income - expenses
      };
    });
  }, [transactions]);

  const data = {
    labels: monthlyData.map(d => d.label),
    datasets: [
      {
        label: 'Net Savings',
        data: monthlyData.map(d => d.savings),
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E533',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Savings Trend (Last 6 Months)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}