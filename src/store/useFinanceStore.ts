import { create } from 'zustand';
import type { Category, MonthFilter, Transaction } from '@/types';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  filter: MonthFilter;
  isLoading: boolean;
  error: string | null;
  /** Transacción que se está editando en el formulario (null = modo crear). */
  editingTransaction: Transaction | null;
}

interface FinanceActions {
  setTransactions: (transactions: Transaction[]) => void;
  setCategories: (categories: Category[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setFilter: (filter: MonthFilter) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
}

const today = new Date();

export const useFinanceStore = create<FinanceState & FinanceActions>()(
  (set) => ({
    // --- Estado inicial ---
    transactions: [],
    categories: [],
    filter: { month: today.getMonth() + 1, year: today.getFullYear() },
    isLoading: false,
    error: null,
    editingTransaction: null,

    // --- Acciones ---
    setTransactions: (transactions) => set({ transactions }),
    setCategories: (categories) => set({ categories }),

    addTransaction: (transaction) =>
      set((state) => ({ transactions: [transaction, ...state.transactions] })),

    updateTransaction: (updated) =>
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === updated.id ? updated : transaction,
        ),
      })),

    removeTransaction: (id) =>
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== id,
        ),
        // Si se borra la que se estaba editando, salimos del modo edición.
        editingTransaction:
          state.editingTransaction?.id === id ? null : state.editingTransaction,
      })),

    setFilter: (filter) => set({ filter }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setEditingTransaction: (editingTransaction) => set({ editingTransaction }),
  }),
);