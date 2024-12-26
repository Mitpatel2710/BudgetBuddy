import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, FileText } from 'lucide-react';
import { MonthlyStatements } from './statements/MonthlyStatements';
import type { Transaction } from '../types/finance';

interface HamburgerMenuProps {
  onSignOut: () => void;
  transactions: Transaction[];
}

export function HamburgerMenu({ onSignOut, transactions }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              setShowStatements(true);
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Statements
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {showStatements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <MonthlyStatements 
              transactions={transactions}
              onClose={() => {
                setShowStatements(false);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}