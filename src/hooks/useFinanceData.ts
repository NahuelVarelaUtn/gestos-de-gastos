'use client';

import { useEffect } from 'react';
import { ensureSession, getCurrentUser } from '@/services/auth.service';
import { getCategories } from '@/services/categories.service';
import { getTransactions } from '@/services/transactions.service';
import { useFinanceStore } from '@/store/useFinanceStore';

/** Carga la sesión y los datos iniciales desde Supabase y los guarda en el store. */
export function useFinanceData(): void {
  const setUser = useFinanceStore((state) => state.setUser);
  const setCategories = useFinanceStore((state) => state.setCategories);
  const setTransactions = useFinanceStore((state) => state.setTransactions);
  const setLoading = useFinanceStore((state) => state.setLoading);
  const setError = useFinanceStore((state) => state.setError);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Primero la sesión: sin ella, RLS no devuelve ninguna fila.
        await ensureSession();

        // Las tres consultas viajan en paralelo.
        const [user, categories, transactions] = await Promise.all([
          getCurrentUser(),
          getCategories(),
          getTransactions(),
        ]);

        setUser(user);
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
  }, [setUser, setCategories, setTransactions, setLoading, setError]);
}