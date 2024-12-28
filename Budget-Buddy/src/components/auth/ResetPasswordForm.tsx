import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import { AuthService } from '../../services/auth';
import { PasswordInput } from '../form/PasswordInput';
import toast from 'react-hot-toast';

interface ResetPasswordFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function ResetPasswordForm({ onBack, onSuccess }: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get access token from URL
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // Remove the # character
      const accessToken = params.get('access_token');

      if (!accessToken) {
        throw new Error('No access token found');
      }

      await AuthService.updatePasswordWithToken(accessToken, formData.newPassword);
      toast.success('Password updated successfully');
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Set New Password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please enter your new password below.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <PasswordInput
            placeholder="New Password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
            minLength={6}
          />

          <PasswordInput
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            'Update Password'
          )}
        </button>
      </form>

      <button
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>
    </div>
  );
}