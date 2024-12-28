import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import { AuthService } from '../../services/auth';
import { StyledInput } from '../form/StyledInput';
import toast from 'react-hot-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await AuthService.resetPassword(email);
      toast.success('Password reset instructions sent to your email');
      onBack();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you instructions to reset your password.
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
        <StyledInput
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          required
          placeholder="Enter your email"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            'Send Reset Instructions'
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