import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/auth';
import { useAuth } from './useAuth';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          // Ignore not found errors as they're expected for new users
          if (error.code !== 'PGRST116') {
            throw error;
          }
        }
        
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error
  };
}