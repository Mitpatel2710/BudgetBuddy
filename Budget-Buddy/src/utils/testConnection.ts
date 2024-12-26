import { supabase } from '../lib/supabase';

export async function testSupabaseConnection() {
  try {
    // Test 1: Basic Connection
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Test 2: Profiles Table Access
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();

    if (profilesError && profilesError.code !== 'PGRST116') {
      console.error('Profiles table error:', profilesError.message);
      return false;
    }

    // Test 3: Transactions Table Access
    const { error: transactionsError } = await supabase
      .from('transactions')
      .select('count')
      .limit(1)
      .single();

    if (transactionsError && transactionsError.code !== 'PGRST116') {
      console.error('Transactions table error:', transactionsError.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}