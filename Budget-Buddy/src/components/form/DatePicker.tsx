import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function DatePicker({ 
  label, 
  error,
  className = '', 
  ...props 
}: DatePickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="date"
          {...props}
          className={`
            block w-full rounded-lg
            pl-10 pr-4 py-3
            bg-white dark:bg-gray-800 
            border-2 border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            transition-all duration-200
            focus:border-blue-500 focus:ring-blue-500
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${error ? 'border-red-300 dark:border-red-700' : ''}
            ${className}
          `}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}