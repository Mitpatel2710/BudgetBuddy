import React, { useState } from 'react';
import { X, Settings, Trash2, Loader } from 'lucide-react';
import { AccountService } from '../../services/account';
import { ManageAccount } from './ManageAccount';
import toast from 'react-hot-toast';

interface AccountMenuProps {
  email: string;
  onClose: () => void;
}

export function AccountMenu({ email, onClose }: AccountMenuProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );

    if (confirmed) {
      setIsDeleting(true);
      try {
        await AccountService.deleteAccount();
        toast.success('Account deleted successfully');
        onClose();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete account');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (showManage) {
    return <ManageAccount onClose={() => setShowManage(false)} />;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Account</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
          {email}
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <button
          onClick={() => setShowManage(true)}
          className="w-full flex items-center justify-between p-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span>Manage Account</span>
          </div>
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="w-full flex items-center justify-between p-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            {isDeleting ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
            <span>{isDeleting ? 'Deleting Account...' : 'Delete Account'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}