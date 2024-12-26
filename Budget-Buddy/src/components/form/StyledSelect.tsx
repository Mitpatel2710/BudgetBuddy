import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
}

export function StyledSelect({ 
  label, 
  icon, 
  options,
  className = '', 
  ...props 
}: StyledSelectProps) {
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
        <select
          {...props}
          className={`
            block w-full rounded-lg
            ${icon ? 'pl-10' : 'pl-4'} pr-10 py-3
            bg-white dark:bg-gray-800 
            border-2 border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            transition-all duration-200
            focus:border-blue-500 focus:ring-blue-500
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            appearance-none
            ${className}
          `}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </motion.div>
  );
}