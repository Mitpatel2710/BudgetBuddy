import React from 'react';
import { format } from 'date-fns';
import { Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

export function AccountDetails() {
  const { user } = useAuth();
  const { profile } = useProfile();

  if (!user) return null;

  const createdAt = new Date(user.created_at);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</p>
            <p className="text-gray-900 dark:text-gray-100">
              {format(createdAt, 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}