import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const createSupabaseClient = () => {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    console.error('Supabase configuration missing - Please click "Connect to Supabase" button');
    return null;
  }

  if (env.supabaseUrl === 'your-project-url' || env.supabaseAnonKey === 'your-anon-key') {
    console.error('Default Supabase configuration detected - Please click "Connect to Supabase" button');
    return null;
  }
  
  try {
    const client = createClient(env.supabaseUrl, env.supabaseAnonKey);
    return client;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export const supabase = createSupabaseClient();