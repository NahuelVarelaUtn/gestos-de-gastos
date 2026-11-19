'use client';

import { useCallback, useState } from 'react';
import { AccountPanel } from '@/components/account/AccountPanel';
import { BudgetForm } from '@/components/budget/BudgetForm';
import { BudgetProgress } from '@/components/budget/BudgetProgress';
import { ExpenseDonut } from '@/components/charts/ExpenseDonut';
import { MonthFilter } from '@/components/summary/MonthFilter';
import { SummaryCards } from '@/components/summary/SummaryCards';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { Modal } from '@/components/ui/Modal';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useFinanceStore } from '@/store/useFinanceStore';

export default function HomePage() {
  useFinanceData();
  const error = useFinanceStore((state) => state.error);
  const editingTransaction = useFinanceStore(
    (state) => state.editingTransaction,
  );
  const setEditingTransaction = useFinanceStore(
    (state) => state.setEditingTransaction,
  );

  // Estado de la UI: solo le importa a esta página, no va al store global.
  const [isCreating, setIsCreating] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const isFormOpen = isCreating || editingTransaction !== null;

  // useCallback mantiene la misma función entre renders,
  // así el efecto del modal no se reinicia a cada rato.
  const closeForm = useCallback(() => {
    setIsCreating(false);
    setEditingTransaction(null);
  }, [setEditingTransaction]);

  const closeBudget = useCallback(() => setIsBudgetOpen(false), []);

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 p-4 pb-28 md:p-8 md:pb-32">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold md:text-3xl">Gestos de Gastos</h1>
        <AccountPanel />
      </header>

      {error && !isFormOpen && (
        <p role="alert" className="rounded-xl bg-coral/10 p-3 text-coral">
          {error}
        </p>
      )}

      <MonthFilter />
      <SummaryCards />

      {/* Bento: una columna en celular, dos en desktop */}
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ExpenseDonut />
        <BudgetProgress onEdit={() => setIsBudgetOpen(true)} />
      </div>

      <TransactionList />

      <FloatingButton onClick={() => setIsCreating(true)} />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingTransaction ? 'Editar transacción' : 'Nueva transacción'}
      >
        <TransactionForm
          key={editingTransaction?.id ?? 'new'}
          onDone={closeForm}
        />
      </Modal>

      <Modal
        isOpen={isBudgetOpen}
        onClose={closeBudget}
        title="Presupuestos mensuales"
      >
        <BudgetForm onDone={closeBudget} />
      </Modal>
    </main>
  );
}