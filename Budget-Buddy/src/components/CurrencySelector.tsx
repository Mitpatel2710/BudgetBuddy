import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { CURRENCIES } from '../types/currency';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        whileTap={{ scale: 0.95 }}
        aria-label="Select currency"
      >
        <CircleDollarSign className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </motion.button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
          {CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              onClick={() => {
                setCurrency(curr);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                currency.code === curr.code ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <span>{curr.name}</span>
              <span className="text-gray-500 dark:text-gray-400">{curr.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}