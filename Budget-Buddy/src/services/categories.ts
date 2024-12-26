import { supabase } from '../lib/supabase';
import type { CustomCategory } from '../types/categories';

export class CategoryService {
  static async createCategory(name: string, color: string, userId: string): Promise<CustomCategory> {
    if (!supabase) {
      throw new Error('Database connection not initialized');
    }

    const { data, error } = await supabase
      .from('custom_categories')
      .insert([{ name, color, user_id: userId }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('A category with this name already exists');
      }
      throw new Error('Failed to create category');
    }

    return data;
  }

  static async getCategories(userId: string): Promise<CustomCategory[]> {
    if (!supabase) {
      throw new Error('Database connection not initialized');
    }

    const { data, error } = await supabase
      .from('custom_categories')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to fetch categories');
    }

    return data || [];
  }
}