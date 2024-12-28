import { supabase } from '../lib/supabase';

export class AccountService {
  static async deleteAccount() {
    if (!supabase) {
      throw new Error('Database connection not initialized');
    }

    try {
      // Get current session to verify authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      // First delete all user data using our custom function
      const { error: deleteDataError } = await supabase.rpc('delete_user_data');

      if (deleteDataError) {
        console.error('Error deleting user data:', deleteDataError);
        throw new Error('Failed to delete account data');
      }

      // Delete the user's auth account
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
        session.user.id
      );

      if (deleteUserError) {
        throw deleteUserError;
      }

      // Finally sign out
      await supabase.auth.signOut();

    } catch (error) {
      console.error('Account deletion error:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('not_admin')) {
          throw new Error('Unable to delete account due to permissions. Please contact support.');
        }
        throw error;
      }

      throw new Error('Failed to delete account. Please try again later.');
    }
  }
}