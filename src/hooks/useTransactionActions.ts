import {
  createTransaction,
  deleteTransaction,
} from '@/services/transactions.service';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { TransactionInput } from '@/types';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error inesperado';

/**
 * Une los servicios con el store: primero guarda en la base
 * y, solo si salió bien, actualiza el estado en memoria.
 */
export function useTransactionActions() {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const removeTransaction = useFinanceStore((state) => state.removeTransaction);
  const setError = useFinanceStore((state) => state.setError);

  /** Devuelve true si se creó correctamente. */
  async function create(input: TransactionInput): Promise<boolean> {
    try {
      const transaction = await createTransaction(input);
      addTransaction(transaction);
      setError(null);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  }

  async function remove(id: string): Promise<void> {
    try {
      await deleteTransaction(id);
      removeTransaction(id);
      setError(null);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return { create, remove };
}