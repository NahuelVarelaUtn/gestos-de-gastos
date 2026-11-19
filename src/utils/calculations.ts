import { parseISO } from 'date-fns';
import type {Category, MonthFilter, Transaction } from '@/types';

export interface BalanceSummary {
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryTotal {
  category: Category;
  total: number;
}

// Sumamos en centavos (enteros) para evitar errores de coma flotante:
// en JavaScript 0.1 + 0.2 da 0.30000000000000004.
const toCents = (amount: number): number => Math.round(amount * 100);
const fromCents = (cents: number): number => cents / 100;

/** Ingresos, gastos y balance (ingresos - gastos) de una lista. */
export function calculateSummary(transactions: Transaction[]): BalanceSummary {
  let incomeCents = 0;
  let expenseCents = 0;

  for (const transaction of transactions) {
    if (transaction.category.type === 'income') {
      incomeCents += toCents(transaction.amount);
    } else {
      expenseCents += toCents(transaction.amount);
    }
  }

  return {
    income: fromCents(incomeCents),
    expenses: fromCents(expenseCents),
    balance: fromCents(incomeCents - expenseCents),
  };
}

/** Devuelve solo las transacciones del mes y año indicados. */
export function filterByMonth(
  transactions: Transaction[],
  { month, year }: MonthFilter,
): Transaction[] {
  return transactions.filter((transaction) => {
    // parseISO interpreta 'YYYY-MM-DD' en hora local.
    // new Date('2026-11-01') lo toma como UTC y en Argentina cae en octubre.
    const date = parseISO(transaction.date);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });
}

/** Gasto total agrupado por categoría, ordenado de mayor a menor. */
export function calculateExpensesByCategory(
  transactions: Transaction[],
): CategoryTotal[] {
  const totals = new Map<string, { category: Category; cents: number }>();

  for (const { category, amount } of transactions) {
    if (category.type !== 'expense') continue;

    const current = totals.get(category.id);
    totals.set(category.id, {
      category,
      cents: (current?.cents ?? 0) + toCents(amount),
    });
  }

  return Array.from(totals.values(), ({ category, cents }) => ({
    category,
    total: fromCents(cents),
  })).sort((a, b) => b.total - a.total);
}

export interface BudgetStatus {
  category: Category;
  spent: number;
  budget: number;
  /** Porcentaje usado del presupuesto (puede superar 100). */
  percentage: number;
}

/** Cuánto se gastó de cada presupuesto, de mayor a menor uso. */
export function calculateBudgetStatus(
  categories: Category[],
  expensesByCategory: CategoryTotal[],
): BudgetStatus[] {
  const spentById = new Map(
    expensesByCategory.map(({ category, total }) => [category.id, total]),
  );

  return categories
    .filter(
      (category): category is Category & { monthly_budget: number } =>
        category.type === 'expense' && category.monthly_budget !== null,
    )
    .map((category) => {
      const spent = spentById.get(category.id) ?? 0;
      const budget = category.monthly_budget;

      return {
        category,
        spent,
        budget,
        percentage: Math.round((spent / budget) * 100),
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}