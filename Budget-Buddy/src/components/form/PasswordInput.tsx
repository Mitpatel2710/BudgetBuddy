import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function PasswordInput({ error, className = '', ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`
          appearance-none relative block w-full pl-10 pr-10 py-2 
          border border-gray-300 dark:border-gray-600 
          placeholder-gray-500 dark:placeholder-gray-400 
          text-gray-900 dark:text-gray-100 
          rounded-md bg-white dark:bg-gray-700
          focus:outline-none focus:ring-purple-500 focus:border-purple-500 
          focus:z-10 sm:text-sm
          ${error ? 'border-red-300 dark:border-red-600' : ''}
          ${className}
        `}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        ) : (
          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        )}
      </button>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}