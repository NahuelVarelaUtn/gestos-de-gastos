'use client';

import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/utils/formatters';

export function TransactionList() {
  const transactions = useFinanceStore((state) => state.transactions);
  const isLoading = useFinanceStore((state) => state.isLoading);
  const { remove } = useTransactionActions();

  function handleDelete(id: string) {
    if (window.confirm('¿Eliminar esta transacción?')) {
      void remove(id);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Transacciones</h2>

      {isLoading && <p className="mt-3 text-slate-500">Cargando...</p>}

      {!isLoading && transactions.length === 0 && (
        <p className="mt-3 text-slate-500">
          Todavía no cargaste ninguna transacción.
        </p>
      )}

      <ul className="mt-2 divide-y divide-slate-100">
        {transactions.map((transaction) => {
          const isIncome = transaction.category.type === 'income';

          return (
            <li
              key={transaction.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {transaction.description ?? transaction.category.name}
                </p>
                <p className="text-sm text-slate-500">
                  {transaction.category.name} ·{' '}
                  <time dateTime={transaction.date}>
                    {formatDate(transaction.date)}
                  </time>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`font-semibold ${
                    isIncome ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(transaction.id)}
                  aria-label={`Eliminar ${transaction.description ?? transaction.category.name}`}
                  className="rounded-lg px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
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