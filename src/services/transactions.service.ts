import { supabase } from '@/lib/supabase';
import type { Transaction, TransactionInput } from '@/types';

// "category:categories(...)" trae la categoría relacionada (un JOIN)
// y la renombra a "category" para que coincida con nuestro tipo.
const TRANSACTION_COLUMNS =
  'id, amount, description, date, ' +
  'category:categories(id, name, type, icon, color, monthly_budget)';

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select(TRANSACTION_COLUMNS)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .overrideTypes<Transaction[], { merge: false }>();

  if (error) throw new Error(`Error al cargar transacciones: ${error.message}`);
  return data;
}

export async function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert(input)
    .select(TRANSACTION_COLUMNS)
    .single()
    .overrideTypes<Transaction, { merge: false }>();

  if (error) throw new Error(`Error al crear la transacción: ${error.message}`);
  return data;
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update(input)
    .eq('id', id)
    .select(TRANSACTION_COLUMNS)
    .single()
    .overrideTypes<Transaction, { merge: false }>();

  if (error) {
    throw new Error(`Error al actualizar la transacción: ${error.message}`);
  }
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id);

  if (error) {
    throw new Error(`Error al eliminar la transacción: ${error.message}`);
  }
}