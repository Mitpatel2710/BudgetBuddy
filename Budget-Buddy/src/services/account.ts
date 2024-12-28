import { supabase } from '../lib/supabase';

export class AccountService {
  /**
   * Validates database connection and user session
   * @throws Error if no connection or active session
   */
  private static async validateConnection(): Promise<void> {
    if (!supabase) {
      throw new Error('Database connection not initialized');
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      throw new Error('No active session found. Please sign in again.');
    }
  }

  /**
   * Deletes all user data using the RPC function
   * @throws Error if deletion fails
   */
  private static async deleteUserData(): Promise<void> {
    const { error } = await supabase.rpc('delete_user_data');
    if (error) {
      console.error('RPC error:', error);
      throw new Error('Failed to delete user data');
    }
  }

  /**
   * Signs out the user and cleans up the session
   */
  private static async cleanupSession(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Signout error:', error);
      // Continue with deletion even if signout fails
    }
  }

  /**
   * Deletes the user account and all associated data
   * @throws Error if deletion process fails
   */
  static async deleteAccount(): Promise<void> {
    try {
      await this.validateConnection();
      await this.deleteUserData();
      await this.cleanupSession();
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Failed to delete account');
    }
  }
}