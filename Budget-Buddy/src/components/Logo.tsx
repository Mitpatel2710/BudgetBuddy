import React from 'react';
import { Wallet } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Wallet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300">
        BudgetBuddy
      </h1>
    </div>
  );
}