import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export class AuthService {
  /**
   * Validates database connection
   * @throws Error if Supabase is not initialized
   */
  private static validateConnection() {
    if (!supabase) {
      throw new Error('Database connection not initialized');
    }
  }

  /**
   * Handles authentication response
   * @throws Error with user-friendly message
   */
  private static handleAuthError(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password';
      case 'Email not confirmed':
        return 'Please verify your email address';
      case 'User not found':
        return 'No account found with this email address';
      case 'New password should be different from the old password':
        return 'New password must be different from your current password';
      case 'Auth session missing!':
        return 'Your session has expired. Please sign in again.';
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
      const response = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (response.error) throw response.error;
      return response.data;
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
      console.error('Sign out error:', error);
      throw error instanceof Error ? error : new Error('Failed to sign out');
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
      const authResponse = await supabase.auth.signUp({ email, password });
      if (authResponse.error) throw authResponse.error;

      const user = authResponse.data.user;
      if (!user) throw new Error('Failed to create user account');

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
   * Sends a password reset email
   */
  static async resetPassword(email: string) {
    this.validateConnection();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error instanceof Error ? error : new Error('Failed to send reset instructions');
    }
  }

  /**
   * Updates user password with access token (for password reset)
   */
  static async updatePasswordWithToken(accessToken: string, newPassword: string) {
    this.validateConnection();

    try {
      // Set the access token in the session
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: ''
      });

      if (sessionError) throw sessionError;

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Password update error:', error);
      throw error instanceof Error ? error : new Error('Failed to update password');
    }
  }

  /**
   * Updates user password (when logged in)
   */
  static async updatePassword(currentPassword: string, newPassword: string) {
    this.validateConnection();

    try {
      // First verify the current password
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('User email not found');

      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Password update error:', error);
      throw error instanceof Error ? error : new Error('Failed to update password');
    }
  }
}