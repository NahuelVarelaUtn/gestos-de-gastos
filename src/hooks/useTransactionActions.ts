import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
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
  const addToStore = useFinanceStore((state) => state.addTransaction);
  const updateInStore = useFinanceStore((state) => state.updateTransaction);
  const removeFromStore = useFinanceStore((state) => state.removeTransaction);
  const setError = useFinanceStore((state) => state.setError);

  /** Devuelve true si se creó correctamente. */
  async function create(input: TransactionInput): Promise<boolean> {
    try {
      addToStore(await createTransaction(input));
      setError(null);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  }

  /** Devuelve true si se actualizó correctamente. */
  async function update(id: string, input: TransactionInput): Promise<boolean> {
    try {
      updateInStore(await updateTransaction(id, input));
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
      removeFromStore(id);
      setError(null);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return { create, update, remove };
}