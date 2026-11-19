import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

const CATEGORY_COLUMNS = 'id, name, type, icon, color, monthly_budget';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_COLUMNS)
    .order('name')
    .overrideTypes<Category[], { merge: false }>();

  if (error) throw new Error(`Error al cargar categorías: ${error.message}`);
  return data;
}

/** Guarda el presupuesto mensual de una categoría (null = sin presupuesto). */
export async function updateCategoryBudget(
  id: string,
  monthlyBudget: number | null,
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ monthly_budget: monthlyBudget })
    .eq('id', id)
    .select(CATEGORY_COLUMNS)
    .single()
    .overrideTypes<Category, { merge: false }>();

  if (error) throw new Error(`Error al guardar el presupuesto: ${error.message}`);
  return data;
}