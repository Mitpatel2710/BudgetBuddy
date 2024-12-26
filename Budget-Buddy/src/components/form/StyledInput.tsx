import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export function StyledInput({ 
  label, 
  icon, 
  error, 
  className = '', 
  ...props 
}: StyledInputProps) {
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
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            block w-full rounded-lg
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            bg-white dark:bg-gray-800 border-2 
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500'
            }
            transition-all duration-200
            placeholder-gray-400 dark:placeholder-gray-500
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${className}
          `}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
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