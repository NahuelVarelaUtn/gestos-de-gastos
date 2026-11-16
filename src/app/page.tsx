'use client';

import { CategoryBreakdown } from '@/components/summary/CategoryBreakdown';
import { MonthFilter } from '@/components/summary/MonthFilter';
import { SummaryCards } from '@/components/summary/SummaryCards';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useFinanceStore } from '@/store/useFinanceStore';

export default function HomePage() {
  useFinanceData();
  const error = useFinanceStore((state) => state.error);
  const editingTransaction = useFinanceStore(
    (state) => state.editingTransaction,
  );

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-6 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">Gestos de Gastos</h1>
      </header>

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-rose-700">
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