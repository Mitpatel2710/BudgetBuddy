import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface CustomCategory {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export function useCustomCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !supabase) return;

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('custom_categories')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching custom categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  const addCategory = async (name: string, color: string) => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('custom_categories')
        .insert([{ name, color, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setCategories([...categories, data]);
      return data;
    } catch (error) {
      console.error('Error adding custom category:', error);
      throw error;
    }
  };

  return {
    categories,
    addCategory,
    loading
  };
}