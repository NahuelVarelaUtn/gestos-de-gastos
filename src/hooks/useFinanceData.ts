'use client';

import { useEffect } from 'react';
import { ensureSession } from '@/services/auth.service';
import { getCategories } from '@/services/categories.service';
import { getTransactions } from '@/services/transactions.service';
import { useFinanceStore } from '@/store/useFinanceStore';

/** Carga los datos iniciales desde Supabase y los guarda en el store. */
export function useFinanceData(): void {
  const setCategories = useFinanceStore((state) => state.setCategories);
  const setTransactions = useFinanceStore((state) => state.setTransactions);
  const setLoading = useFinanceStore((state) => state.setLoading);
  const setError = useFinanceStore((state) => state.setError);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        await ensureSession();
        // Las dos consultas viajan en paralelo.
        const [categories, transactions] = await Promise.all([
          getCategories(),
          getTransactions(),
        ]);
        setCategories(categories);
        setTransactions(transactions);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error inesperado');
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [setCategories, setTransactions, setLoading, setError]);
}