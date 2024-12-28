import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, DollarSign, Tag, Calendar } from 'lucide-react';
import type { Transaction } from '../types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, REFUND_CATEGORIES } from '../constants/categories';
import { StyledInput } from './form/StyledInput';
import { StyledSelect } from './form/StyledSelect';
import { DatePicker } from './form/DatePicker';
import { validateAmount, validateDescription, validateDate } from '../utils/validation';
import { useFormatMoney } from '../utils/format';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currency } = useCurrency();
  const formatMoney = useFormatMoney();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: EXPENSE_CATEGORIES[0],
    type: 'expense' as 'income' | 'expense' | 'refund',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({
    amount: '',
    description: '',
    date: ''
  });

  // Helper functions for form handling
  const handleTypeChange = (type: 'income' | 'expense' | 'refund') => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'income'
        ? INCOME_CATEGORIES[0]
        : type === 'refund'
          ? REFUND_CATEGORIES[0]
          : EXPENSE_CATEGORIES[0]
    }));
  };

  const getCategoryOptions = () => {
    switch (formData.type) {
      case 'income': return INCOME_CATEGORIES;
      case 'refund': return REFUND_CATEGORIES;
      default: return EXPENSE_CATEGORIES;
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const amountError = validateAmount(formData.amount);
    const descriptionError = validateDescription(formData.description);
    const dateError = validateDate(formData.date);

    setErrors({
      amount: amountError || '',
      description: descriptionError || '',
      date: dateError || ''
    });

    if (amountError || descriptionError || dateError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTransaction({
        amount: Number(formData.amount),
        description: formData.description,
        category: formData.category,
        type: formData.type,
        date: formData.date
      });

      // Reset form
      setFormData({
        amount: '',
        description: '',
        category: EXPENSE_CATEGORIES[0],
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });

      toast.success('Transaction added successfully');
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // JSX for the form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Transaction</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <StyledSelect
          label="Type"
          value={formData.type}
          onChange={(e) => handleTypeChange(e.target.value as 'income' | 'expense' | 'refund')}
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
            { value: 'refund', label: 'Refund' }
          ]}
          icon={<Tag className="h-5 w-5 text-gray-400" />}
        />

        <StyledInput
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
          icon={<span className="text-gray-400">{currency.symbol}</span>}
          placeholder="Enter amount"
          step="0.01"
          min="0"
        />

        <StyledSelect
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={getCategoryOptions().map(cat => ({ value: cat, label: cat }))}
          icon={<Tag className="h-5 w-5 text-gray-400" />}
        />

        <StyledInput
          label="Description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          placeholder="Enter description"
        />

        <DatePicker
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Add Transaction'
          )}
        </button>
      </form>
    </motion.div>
  );
}
