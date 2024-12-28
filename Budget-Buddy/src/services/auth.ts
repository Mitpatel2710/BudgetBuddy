// import { AuthError, AuthResponse } from '@supabase/supabase-js';
// import { supabase } from '../lib/supabase';
//
// export class AuthService {
//   static async signIn(email: string, password: string) {
//     if (!supabase) {
//       throw new Error('Database connection not initialized. Please connect to Supabase first.');
//     }
//
//     try {
//       const response = await supabase.auth.signInWithPassword({ email, password });
//       return this.handleAuthResponse(response);
//     } catch (error) {
//       console.error('Sign in error:', error);
//       throw new Error('Unable to connect to authentication service. Please try again.');
//     }
//   }
//
//   static async signUp(email: string, password: string, firstName: string, lastName: string) {
//     if (!supabase) {
//       throw new Error('Database connection not initialized. Please connect to Supabase first.');
//     }
//
//     try {
//       // First check if user exists
//       const { data: existingUser } = await supabase
//         .from('profiles')
//         .select('id')
//         .eq('email', email)
//         .maybeSingle();
//
//       if (existingUser) {
//         throw new Error('An account with this email already exists.');
//       }
//
//       const authResponse = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             first_name: firstName,
//             last_name: lastName
//           }
//         }
//       });
//
//       if (authResponse.error) {
//         throw this.formatAuthError(authResponse.error);
//       }
//
//       if (!authResponse.data.user) {
//         throw new Error('Account creation failed. Please try again.');
//       }
//
//       // Create profile
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .insert([
//           {
//             id: authResponse.data.user.id,
//             first_name: firstName,
//             last_name: lastName,
//             email: email
//           }
//         ]);
//
//       if (profileError) {
//         console.error('Profile creation error:', profileError);
//         // Clean up auth user if profile creation fails
//         await supabase.auth.signOut();
//         throw new Error('Failed to create user profile. Please try again.');
//       }
//
//       return authResponse.data;
//     } catch (error) {
//       console.error('Sign up error:', error);
//       throw error instanceof Error ? error : new Error('Registration failed. Please try again.');
//     }
//   }
//
//   static async resetPassword(email: string) {
//     if (!supabase) {
//       throw new Error('Database connection not initialized. Please connect to Supabase first.');
//     }
//
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: window.location.origin + '/#/reset-password'
//       });
//
//       if (error) throw this.formatAuthError(error);
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error instanceof Error ? error : new Error('Failed to send reset password email.');
//     }
//   }
//
//   static async updatePassword(token: string, newPassword: string) {
//     if (!supabase) {
//       throw new Error('Database connection not initialized. Please connect to Supabase first.');
//     }
//
//     try {
//       const { error } = await supabase.auth.updateUser({
//         password: newPassword
//       });
//
//       if (error) throw this.formatAuthError(error);
//     } catch (error) {
//       console.error('Update password error:', error);
//       throw error instanceof Error ? error : new Error('Failed to update password.');
//     }
//   }
//
//   static async deleteAccount() {
//     if (!supabase) {
//       throw new Error('Database connection not initialized');
//     }
//
//     try {
//       const user = (await supabase.auth.getUser()).data.user;
//       if (!user) throw new Error('No authenticated user found');
//
//       // Delete all user data in order
//       const { error: transactionsError } = await supabase
//         .from('transactions')
//         .delete()
//         .eq('user_id', user.id);
//
//       if (transactionsError) throw transactionsError;
//
//       const { error: categoriesError } = await supabase
//         .from('custom_categories')
//         .delete()
//         .eq('user_id', user.id);
//
//       if (categoriesError) throw categoriesError;
//
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .delete()
//         .eq('id', user.id);
//
//       if (profileError) throw profileError;
//
//       // Finally, delete the user's auth account
//       const { error: deleteError } = await supabase.rpc('delete_user');
//       if (deleteError) throw deleteError;
//
//       // Sign out after successful deletion
//       await supabase.auth.signOut();
//
//       return true;
//     } catch (error) {
//       console.error('Delete account error:', error);
//       throw new Error('Failed to delete account. Please try again.');
//     }
//   }
//
//   private static handleAuthResponse(response: AuthResponse) {
//     if (response.error) {
//       throw this.formatAuthError(response.error);
//     }
//     return response.data;
//   }
//
//   private static formatAuthError(error: AuthError): Error {
//     console.error('Auth error details:', error);
//
//     switch (error.message) {
//       case 'Invalid login credentials':
//         return new Error('Invalid email or password. Please check your credentials and try again.');
//       case 'Email not confirmed':
//         return new Error('Please verify your email address before signing in.');
//       case 'User not found':
//         return new Error('No account found with this email address. Please sign up first.');
//       case 'Password should be at least 6 characters':
//         return new Error('Password must be at least 6 characters long.');
//       default:
//         return new Error(error.message || 'Authentication failed. Please try again.');
//     }
//   }
// }


import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export class AuthService {
  // Sign In
  static async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Database connection not initialized.');
    }

    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (response.error) {
        throw this.formatAuthError(response.error);
      }
      return response.data;
    } catch (error) {
      console.error('Sign-in error:', error);
      throw new Error(error.message || 'An unexpected error occurred during sign-in.');
    }
  }

  // Sign Up
  static async signUp(email: string, password: string, firstName: string, lastName: string) {
    if (!supabase) {
      throw new Error('Database connection not initialized.');
    }

    try {
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
            last_name: lastName,
          },
        },
      });

      if (authResponse.error) {
        throw this.formatAuthError(authResponse.error);
      }

      const userId = authResponse.data.user?.id;
      if (!userId) {
        throw new Error('Account creation failed. Please try again.');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: userId, first_name: firstName, last_name: lastName, email }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        await supabase.auth.api.deleteUser(userId);
        throw new Error('Failed to create user profile. Please try again.');
      }

      return authResponse.data;
    } catch (error) {
      console.error('Sign-up error:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  // Reset Password
  static async resetPassword(email: string) {
    if (!supabase) {
      throw new Error('Database connection not initialized.');
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (error) {
        throw this.formatAuthError(error);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to send reset password email.');
    }
  }

  // Update Password
  static async updatePassword(newPassword: string) {
    if (!supabase) {
      throw new Error('Database connection not initialized.');
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        throw this.formatAuthError(error);
      }
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error(error.message || 'Failed to update password.');
    }
  }

  // Format Authentication Errors
  private static formatAuthError(error: AuthError): Error {
    console.error('Auth error details:', error);

    switch (error.message) {
      case 'Invalid login credentials':
        return new Error('Invalid email or password. Please try again.');
      case 'Email not confirmed':
        return new Error('Please verify your email address before signing in.');
      case 'User not found':
        return new Error('No account found with this email. Please sign up.');
      case 'Password should be at least 6 characters':
        return new Error('Password must be at least 6 characters long.');
      default:
        return new Error(error.message || 'Authentication failed. Please try again.');
    }
  }
}

