'use client';

import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

const ICON_BUTTON_CLASS =
  'rounded-lg px-2 py-1 text-mist transition-colors';

export function TransactionList() {
  // La lista respeta el filtro de mes.
  const { monthlyTransactions: transactions } = useFinanceSummary();
  const setEditingTransaction = useFinanceStore(
    (state) => state.setEditingTransaction,
  );
  const isLoading = useFinanceStore((state) => state.isLoading);
  const { remove } = useTransactionActions();

  function handleDelete(id: string) {
    if (window.confirm('¿Eliminar esta transacción?')) {
      void remove(id);
    }
  }

  return (
    <section className="glass-card p-4">
      <h2 className="text-lg font-semibold">Transacciones</h2>

      {isLoading && <p className="mt-3 text-mist">Cargando...</p>}

      {!isLoading && transactions.length === 0 && (
        <p className="mt-3 text-mist">No hay transacciones en este mes.</p>
      )}

      <ul className="mt-2 divide-y divide-white/10">
        {transactions.map((transaction) => {
          const isIncome = transaction.category.type === 'income';
          const label = transaction.description ?? transaction.category.name;

          return (
            <li
              key={transaction.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
  <CategoryIcon category={transaction.category} />
  <div className="min-w-0">
    <p className="truncate font-medium">
      {transaction.description ?? transaction.category.name}
    </p>
    <p className="text-sm text-mist">
      {transaction.category.name} ·{' '}
      <time dateTime={transaction.date}>
        {formatDate(transaction.date)}
      </time>
    </p>
  </div>
</div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`font-semibold ${
                    isIncome ? 'text-aqua' : 'text-coral'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTransaction(transaction);
                    // En celular el formulario queda arriba: lo traemos a la vista.
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label={`Editar ${label}`}
                  className={`${ICON_BUTTON_CLASS} hover:bg-ocean/10 hover:text-ocean`}
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(transaction.id)}
                  aria-label={`Eliminar ${label}`}
                  className={`${ICON_BUTTON_CLASS} hover:bg-coral/10 hover:text-coral`}
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}