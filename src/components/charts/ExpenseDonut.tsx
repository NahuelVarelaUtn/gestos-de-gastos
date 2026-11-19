'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import type { Category } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

// Geometría del donut (en unidades del viewBox de 100x100).
const RADIUS = 40;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 1.5; // separación entre porciones, en unidades de trazo

interface Segment {
  category: Category;
  amount: number;
  percentage: number;
  /** Punto de inicio de la porción, en % del círculo. */
  start: number;
}

export function ExpenseDonut() {
  const { expensesByCategory, monthlySummary, monthlyTransactions } =
    useFinanceSummary();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const total = monthlySummary.expenses;

  // Cada porción empieza donde terminó la anterior.
  const segments = expensesByCategory.reduce<Segment[]>(
    (accumulated, { category, total: amount }) => {
      const previous = accumulated.at(-1);
      const start = previous ? previous.start + previous.percentage : 0;
      accumulated.push({
        category,
        amount,
        percentage: (amount / total) * 100,
        start,
      });
      return accumulated;
    },
    [],
  );

  const selected =
    segments.find(({ category }) => category.id === selectedId) ?? null;

  // El "desglose": transacciones de la categoría elegida.
  const selectedTransactions = selected
    ? monthlyTransactions.filter(
        (transaction) => transaction.category.id === selected.category.id,
      )
    : [];

  function toggleCategory(id: string) {
    setSelectedId((current) => (current === id ? null : id));
  }

  return (
    <section className="glass-card p-4">
      <h2 className="text-lg font-semibold">Gastos por categoría</h2>

      {segments.length === 0 ? (
        <p className="mt-3 text-sm text-mist">
          No hay gastos en este mes. Tocá <strong className="text-glacier">+</strong>{' '}
          para cargar el primero y ver cómo se reparte tu dinero.
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-mist">
            Tocá una categoría para ver el detalle.
          </p>

          <div className="relative mx-auto mt-4 size-56">
            {/* aria-hidden: la leyenda de abajo es la versión accesible */}
            <svg
              viewBox="0 0 100 100"
              className="size-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="rgb(255 255 255 / 0.06)"
                strokeWidth={STROKE}
              />
              {segments.map(({ category, percentage, start }) => {
                const isSelected = category.id === selectedId;
                const isDimmed = selectedId !== null && !isSelected;
                const length = (percentage / 100) * CIRCUMFERENCE;
                const visibleLength =
                  segments.length > 1 ? Math.max(length - GAP, 0.5) : length;

                return (
                  <motion.circle
                    key={category.id}
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    stroke={category.color}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                    // Se "dibuja" desde 0 hasta su largo real.
                    initial={{
                      strokeDasharray: `0 ${CIRCUMFERENCE}`,
                      strokeDashoffset: -(start / 100) * CIRCUMFERENCE,
                    }}
                    animate={{
                      strokeDasharray: `${visibleLength} ${CIRCUMFERENCE - visibleLength}`,
                      strokeDashoffset: -(start / 100) * CIRCUMFERENCE,
                      strokeWidth: isSelected ? STROKE + 4 : STROKE,
                      opacity: isDimmed ? 0.3 : 1,
                    }}
                    whileHover={{ strokeWidth: STROKE + 3 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                );
              })}
            </svg>

            {/* Texto central: total del mes o de la categoría elegida */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-mist">
                {selected ? selected.category.name : 'Gastos del mes'}
              </span>
              <span className="text-xl font-bold">
                {formatCurrency(selected ? selected.amount : total)}
              </span>
            </div>
          </div>

          {/* Leyenda: también funciona como selector, con teclado */}
          <ul className="mt-4 grid grid-cols-2 gap-1">
            {segments.map(({ category, percentage }) => {
              const isSelected = category.id === selectedId;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-white/5 ${
                      isSelected ? 'bg-white/10' : ''
                    }`}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate">{category.name}</span>
                    <span className="ml-auto text-mist">
                      {Math.round(percentage)}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Desglose animado de la categoría elegida */}
          <AnimatePresence mode="wait" initial={false}>
            {selected && (
              <motion.div
                key={selected.category.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-xl bg-white/5 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <CategoryIcon category={selected.category} size="sm" />
                    <h3 className="font-semibold">
                      Detalle de {selected.category.name}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {selectedTransactions.map((transaction, index) => (
                      <motion.li
                        key={transaction.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between gap-3"
                      >
                        <span className="truncate">
                          {transaction.description ?? transaction.category.name}
                          <span className="text-mist">
                            {' '}· {formatDate(transaction.date)}
                          </span>
                        </span>
                        <span className="shrink-0 text-coral">
                          -{formatCurrency(transaction.amount)}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}