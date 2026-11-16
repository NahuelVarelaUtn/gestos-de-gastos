import { create } from 'zustand';
import type { Category, MonthFilter, Transaction } from '@/types';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  filter: MonthFilter;
  isLoading: boolean;
  error: string | null;
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
      })),

    setFilter: (filter) => set({ filter }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }),
);