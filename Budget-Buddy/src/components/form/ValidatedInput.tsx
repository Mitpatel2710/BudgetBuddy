import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function ValidatedInput({ 
  label, 
  error, 
  className = '', 
  ...props 
}: ValidatedInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          {...props}
          className={`block w-full rounded-md shadow-sm 
            ${error 
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            } ${className}`}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}