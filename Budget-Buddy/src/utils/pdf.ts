import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Transaction } from '../types/finance';
import { getMonthName } from './date';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export async function generatePDF(transactions: Transaction[], date: Date): Promise<void> {
  const doc = new jsPDF();
  const monthYear = `${getMonthName(date)} ${date.getFullYear()}`;

  // Add header
  doc.setFontSize(20);
  doc.text('BudgetBuddy Statement', 14, 15);
  doc.setFontSize(12);
  doc.text(monthYear, 14, 25);

  // Prepare table data
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.description,
    t.category,
    t.type === 'income' ? `+$${t.amount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`
  ]);

  // Calculate totals
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
      } else {
        acc.expenses += t.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  // Add table
  doc.autoTable({
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: tableData,
    startY: 35,
    theme: 'striped',
    headStyles: { fillColor: [102, 102, 255] }
  });

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Total Income: $${totals.income.toFixed(2)}`, 14, finalY);
  doc.text(`Total Expenses: $${totals.expenses.toFixed(2)}`, 14, finalY + 7);
  doc.text(`Net Savings: $${(totals.income - totals.expenses).toFixed(2)}`, 14, finalY + 14);

  // Save the PDF
  doc.save(`budget-statement-${monthYear.toLowerCase()}.pdf`);
}