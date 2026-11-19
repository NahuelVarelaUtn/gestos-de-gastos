import { useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import {
  calculateBudgetStatus,
  calculateExpensesByCategory,
  calculateSummary,
  filterByMonth,
} from '@/utils/calculations';

/** Expone los balances ya calculados para cualquier componente. */
export function useFinanceSummary() {
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const filter = useFinanceStore((state) => state.filter);

  return useMemo(() => {
    const monthlyTransactions = filterByMonth(transactions, filter);
    const expensesByCategory = calculateExpensesByCategory(monthlyTransactions);

    return {
      monthlyTransactions,
      generalSummary: calculateSummary(transactions),
      monthlySummary: calculateSummary(monthlyTransactions),
      expensesByCategory,
      budgetStatus: calculateBudgetStatus(categories, expensesByCategory),
    };
  }, [transactions, categories, filter]);
}