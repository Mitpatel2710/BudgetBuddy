import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, FileText, UserCircle } from 'lucide-react';
import { MonthlyStatements } from './statements/MonthlyStatements';
import { AccountMenu } from './account/AccountMenu';
import type { Transaction } from '../types/finance';
import { useAuth } from '../hooks/useAuth';

interface HamburgerMenuProps {
  onSignOut: () => void;
  transactions: Transaction[];
}

export function HamburgerMenu({ onSignOut, transactions }: HamburgerMenuProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setIsOpen(false);
    setShowStatements(false);
    setShowAccount(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowAccount(true)}
            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <UserCircle className="w-4 h-4" />
            Account
          </button>

          <button
            onClick={() => setShowStatements(true)}
            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Statements
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <button
            onClick={() => {
              closeAll();
              onSignOut();
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {showStatements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <MonthlyStatements
              transactions={transactions}
              onClose={closeAll}
            />
          </div>
        </div>
      )}

      {showAccount && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <AccountMenu
              email={user.email || ''}
              onClose={closeAll}
            />
          </div>
        </div>
      )}
    </div>
  );
}