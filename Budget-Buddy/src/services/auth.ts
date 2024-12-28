import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export class AuthService {
  /**
   * Validates database connection
   * @throws Error if Supabase is not initialized
   */
  private static validateConnection() {
    if (!supabase) {
      throw new Error('Database connection not initialized. Please connect to Supabase first.');
    }
  }

  /**
   * Handles authentication response
   * @throws Error with user-friendly message
   */
  private static handleAuthResponse(response: AuthResponse) {
    if (response.error) {
      throw new Error(this.getAuthErrorMessage(response.error));
    }
    return response.data;
  }

  /**
   * Converts auth errors to user-friendly messages
   */
  private static getAuthErrorMessage(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password';
      case 'Email not confirmed':
        return 'Please verify your email address';
      case 'User not found':
        return 'No account found with this email address';
      default:
        return error.message;
    }
  }

  /**
   * Signs in a user
   */
  static async signIn(email: string, password: string) {
    this.validateConnection();

    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      
      // Check if user exists in auth but not in profiles
      if (response.data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', response.data.user.id)
          .single();

        if (!profile) {
          await supabase.auth.signOut();
          throw new Error('No account found with this email address. Please sign up first.');
        }
      }

      return this.handleAuthResponse(response);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error instanceof Error ? error : new Error('Authentication failed');
    }
  }

  /**
   * Signs out the current user
   */
  static async signOut() {
    this.validateConnection();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      // Ignore user_not_found errors during signout
      if (error instanceof Error && !error.message.includes('user_not_found')) {
        console.error('Sign out error:', error);
        throw error;
      }
    }
  }

  /**
   * Signs up a new user
   */
  static async signUp(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) {
    this.validateConnection();

    try {
      // Sign up the user
      const authResponse = await supabase.auth.signUp({ email, password });
      if (authResponse.error) throw authResponse.error;

      const user = authResponse.data.user;
      if (!user) throw new Error('Failed to create user account');

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email,
          first_name: firstName,
          last_name: lastName
        }]);

      if (profileError) {
        // Cleanup: delete auth user if profile creation fails
        await supabase.auth.admin.deleteUser(user.id);
        throw profileError;
      }

      return authResponse.data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error instanceof Error ? error : new Error('Failed to create account');
    }
  }

  /**
   * Resets user password
   */
  static async resetPassword(email: string) {
    this.validateConnection();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error instanceof Error ? error : new Error('Failed to send reset instructions');
    }
  }

  /**
   * Updates user password
   */
  static async updatePassword(token: string, newPassword: string) {
    this.validateConnection();

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error) {
      console.error('Password update error:', error);
      throw error instanceof Error ? error : new Error('Failed to update password');
    }
  }
}