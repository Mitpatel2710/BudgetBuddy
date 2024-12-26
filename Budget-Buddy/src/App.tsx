import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/auth/LoginForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { ConnectSupabase } from './components/ConnectSupabase';
import { HamburgerMenu } from './components/HamburgerMenu';
import { ThemeToggle } from './components/ThemeToggle';
import { Logo } from './components/Logo';
import { useTransactions } from './hooks/useTransactions';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';

export function App() {
  const { user, loading: authLoading, signOut, isSupabaseConnected } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { transactions, addTransaction, clearTransactions, summary, loading: transactionsLoading } = useTransactions();
  
  // Parse hash-based URL parameters
  const hashParams = window.location.hash.split('#')[1] || '';
  const [hashPath, queryString] = hashParams.split('?');
  const params = new URLSearchParams(queryString || '');
  const resetToken = params.get('token');
  const isResetPasswordPage = hashPath === '/reset-password';

  if (!isSupabaseConnected) {
    return <ConnectSupabase />;
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    if (isResetPasswordPage && resetToken) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <ResetPasswordForm 
              token={resetToken} 
              onBack={() => window.location.hash = ''} 
              onSuccess={() => {
                window.location.hash = '';
                window.location.reload();
              }} 
            />
          </div>
          <Toaster position="top-right" />
        </div>
      );
    }

    return (
      <>
        <LoginForm onSuccess={() => {}} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Toaster position="top-right" />
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {profile ? `${profile.first_name} ${profile.last_name}` : user.email}
              </span>
              <HamburgerMenu onSignOut={signOut} transactions={transactions} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard 
          summary={summary} 
          transactions={transactions} 
          onClearTransactions={clearTransactions}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TransactionForm onAddTransaction={addTransaction} />
          <TransactionList transactions={transactions} loading={transactionsLoading} />
        </div>
      </main>
    </div>
  );
}