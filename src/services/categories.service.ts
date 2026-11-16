import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, type')
    .order('name')
    .overrideTypes<Category[], { merge: false }>();

  if (error) throw new Error(`Error al cargar categorías: ${error.message}`);
  return data;
}