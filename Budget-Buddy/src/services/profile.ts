import { supabase } from '../lib/supabase';
import type { Profile } from '../types/auth';

export class ProfileService {
  static async updateProfile(profile: Partial<Profile>): Promise<void> {
    if (!supabase) {
      throw new Error('Database connection not initialized');
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (error) {
      throw new Error('Failed to update profile');
    }
  }
}