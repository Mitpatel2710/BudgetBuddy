import React, { useState } from 'react';
import { Mail, AlertCircle, X } from 'lucide-react';
import { AccountService } from '../../services/account';
import { StyledInput } from '../form/StyledInput';
import toast from 'react-hot-toast';

interface ManageAccountProps {
  currentEmail: string;
  onClose: () => void;
}

export function ManageAccount({ currentEmail, onClose }: ManageAccountProps) {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    if (newEmail === currentEmail) {
      setError('New email must be different from current email');
      return;
    }

    const confirmed = window.confirm(
      'After updating your email, you will be signed out. You can then sign in using your new email address with your existing password. Do you want to continue?'
    );

    if (!confirmed) return;

    setLoading(true);
    setError('');

    try {
      await AccountService.updateEmail(newEmail);
      toast.success('Email updated successfully. Please sign in with your new email.');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Manage Account
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleUpdateEmail} className="space-y-4">
        <StyledInput
          label="Current Email"
          value={currentEmail}
          disabled
          icon={<Mail className="h-5 w-5 text-gray-400" />}
        />

        <StyledInput
          label="New Email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          placeholder="Enter new email"
          required
        />

        {error && (
          <div className="flex items-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Update Email'
          )}
        </button>
      </form>
    </div>
  );
}