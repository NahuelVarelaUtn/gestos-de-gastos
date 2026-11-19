'use client';

import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { formatCurrency } from '@/utils/formatters';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

export function CategoryBreakdown() {
  const { expensesByCategory, monthlySummary } = useFinanceSummary();
  const totalExpenses = monthlySummary.expenses;

  return (
    <section className="glass-card p-4">
      <h2 className="text-lg font-semibold">Gastos por categoría</h2>

      {expensesByCategory.length === 0 && (
        <p className="mt-3 text-mist">No hay gastos en este mes.</p>
      )}

      <ul className="mt-3 space-y-3">
       {expensesByCategory.map(({ category, total }) => {
  const percentage =
    totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;

  return (
    <li key={category.id} className="flex items-center gap-3">
      <CategoryIcon category={category} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{category.name}</span>
          <span className="text-mist">
            {formatCurrency(total)} · {percentage}%
          </span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: category.color }}
          />
        </div>
      </div>
    </li>
  );
})}
      </ul>
    </section>
  );
}