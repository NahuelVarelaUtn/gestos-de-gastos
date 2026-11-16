import { useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import {
  calculateExpensesByCategory,
  calculateSummary,
  filterByMonth,
} from '@/utils/calculations';

/** Expone los balances ya calculados para cualquier componente. */
export function useFinanceSummary() {
  // Un selector por valor: el componente solo se re-renderiza
  // cuando cambia exactamente lo que usa.
  const transactions = useFinanceStore((state) => state.transactions);
  const filter = useFinanceStore((state) => state.filter);

  return useMemo(() => {
    const monthlyTransactions = filterByMonth(transactions, filter);

    return {
      monthlyTransactions,
      generalSummary: calculateSummary(transactions),
      monthlySummary: calculateSummary(monthlyTransactions),
      expensesByCategory: calculateExpensesByCategory(monthlyTransactions),
    };
  }, [transactions, filter]);
}