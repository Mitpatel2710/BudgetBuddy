import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export class AuthService {
  static async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Database connection not initialized. Please connect to Supabase first.');
    }

    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      return this.handleAuthResponse(response);
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Unable to connect to authentication service. Please try again.');
    }
  }

  static async signUp(email: string, password: string, firstName: string, lastName: string) {
    if (!supabase) {
      throw new Error('Database connection not initialized. Please connect to Supabase first.');
    }

    try {
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('An account with this email already exists.');
      }

      const authResponse = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (authResponse.error) {
        throw this.formatAuthError(authResponse.error);
      }

      if (!authResponse.data.user) {
        throw new Error('Account creation failed. Please try again.');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authResponse.data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Clean up auth user if profile creation fails
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile. Please try again.');
      }

      return authResponse.data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error instanceof Error ? error : new Error('Registration failed. Please try again.');
    }
  }

  private static handleAuthResponse(response: AuthResponse) {
    if (response.error) {
      throw this.formatAuthError(response.error);
    }
    return response.data;
  }

  private static formatAuthError(error: AuthError): Error {
    console.error('Auth error details:', error);
    
    switch (error.message) {
      case 'Invalid login credentials':
        return new Error('Invalid email or password. Please check your credentials and try again.');
      case 'Email not confirmed':
        return new Error('Please verify your email address before signing in.');
      case 'User not found':
        return new Error('No account found with this email address. Please sign up first.');
      case 'Password should be at least 6 characters':
        return new Error('Password must be at least 6 characters long.');
      default:
        return new Error(error.message || 'Authentication failed. Please try again.');
    }
  }
}