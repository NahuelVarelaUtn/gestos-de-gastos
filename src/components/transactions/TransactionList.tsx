'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/utils/formatters';

const ACTION_BUTTON_CLASS = 'rounded-lg p-2 text-mist';

export function TransactionList() {
  // La lista respeta el filtro de mes.
  const { monthlyTransactions: transactions } = useFinanceSummary();
  const isLoading = useFinanceStore((state) => state.isLoading);
  const setEditingTransaction = useFinanceStore(
    (state) => state.setEditingTransaction,
  );
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
        {/* initial={false}: no anima las filas en la primera carga */}
        <AnimatePresence initial={false}>
          {transactions.map((transaction) => {
            const isIncome = transaction.category.type === 'income';
            const label = transaction.description ?? transaction.category.name;

            return (
              <motion.li
                key={transaction.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CategoryIcon category={transaction.category} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{label}</p>
                    <p className="text-sm text-mist">
                      {transaction.category.name} ·{' '}
                      <time dateTime={transaction.date}>
                        {formatDate(transaction.date)}
                      </time>
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <span
                    className={`mr-1 font-semibold ${
                      isIncome ? 'text-aqua' : 'text-coral'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingTransaction(transaction)}
                    aria-label={`Editar ${label}`}
                    className={`${ACTION_BUTTON_CLASS} hover:bg-ocean/10 hover:text-ocean`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(transaction.id)}
                    aria-label={`Eliminar ${label}`}
                    className={`${ACTION_BUTTON_CLASS} hover:bg-coral/10 hover:text-coral`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}