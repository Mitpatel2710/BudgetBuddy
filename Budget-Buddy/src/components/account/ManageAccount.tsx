import React from 'react';
import { X, User, Lock, Info } from 'lucide-react';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { AccountDetails } from './AccountDetails';

interface ManageAccountProps {
  onClose: () => void;
}

export function ManageAccount({ onClose }: ManageAccountProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Account</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Account Information</h3>
            </div>
            <AccountDetails />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Personal Information</h3>
            </div>
            <ProfileForm />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
            </div>
            <PasswordForm />
          </section>
        </div>
      </div>
    </div>
  );
}