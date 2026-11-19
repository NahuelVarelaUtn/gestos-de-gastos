'use client';

import { AccountPanel } from '@/components/account/AccountPanel';
import { CategoryBreakdown } from '@/components/summary/CategoryBreakdown';
import { MonthFilter } from '@/components/summary/MonthFilter';
import { SummaryCards } from '@/components/summary/SummaryCards';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useFinanceStore } from '@/store/useFinanceStore';

export function Dashboard() {
  useFinanceData();
  const error = useFinanceStore((state) => state.error);
  const editingTransaction = useFinanceStore(
    (state) => state.editingTransaction,
  );

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-6 p-4 md:p-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold md:text-3xl">Gestos de Gastos</h1>
        <AccountPanel />
      </header>

      {error && (
        <p role="alert" className="rounded-lg bg-coral/10 p-3 text-coral">
          {error}
        </p>
      )}

      <MonthFilter />
      <SummaryCards />
      {/* Al cambiar la key, React recrea el formulario con los datos nuevos */}
      <TransactionForm key={editingTransaction?.id ?? 'new'} />
      <CategoryBreakdown />
      <TransactionList />
    </main>
  );
}