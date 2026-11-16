'use client';

import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { formatCurrency } from '@/utils/formatters';

export function CategoryBreakdown() {
  const { expensesByCategory, monthlySummary } = useFinanceSummary();
  const totalExpenses = monthlySummary.expenses;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Gastos por categoría</h2>

      {expensesByCategory.length === 0 && (
        <p className="mt-3 text-slate-500">No hay gastos en este mes.</p>
      )}

      <ul className="mt-3 space-y-3">
        {expensesByCategory.map(({ categoryId, name, total }) => {
          const percentage =
            totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;

          return (
            <li key={categoryId}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{name}</span>
                <span className="text-slate-600">
                  {formatCurrency(total)} · {percentage}%
                </span>
              </div>
              {/* Barra de progreso: el ancho sale del porcentaje */}
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}