'use client';

import { Settings2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { formatCurrency } from '@/utils/formatters';

// Mismos valores que los tokens: Motion necesita colores reales
// (no variables CSS) para poder interpolar entre uno y otro.
const BUDGET_COLORS = {
  ok: '#2ec4b6', // aqua
  warning: '#f4c95d', // ámbar suave
  over: '#ff7b7b', // coral
};

/** Color de la barra según cuánto se usó del presupuesto. */
function getBudgetColor(percentage: number): string {
  if (percentage > 100) return BUDGET_COLORS.over;
  if (percentage >= 75) return BUDGET_COLORS.warning;
  return BUDGET_COLORS.ok;
}

interface BudgetProgressProps {
  onEdit: () => void;
}

export function BudgetProgress({ onEdit }: BudgetProgressProps) {
  const { budgetStatus } = useFinanceSummary();

  return (
    <section className="glass-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Presupuestos</h2>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-ocean hover:bg-ocean/10"
        >
          <Settings2 className="size-4" />
          Editar
        </button>
      </div>

      {budgetStatus.length === 0 && (
        <p className="mt-3 text-sm text-mist">
          Definí cuánto querés gastar por mes en cada categoría y seguí tu
          avance acá. Tocá <strong className="text-glacier">Editar</strong> para
          empezar.
        </p>
      )}

      <ul className="mt-4 space-y-4">
        {budgetStatus.map(({ category, spent, budget, percentage }) => {
          const color = getBudgetColor(percentage);
          const remaining = budget - spent;
          const barWidth = Math.min(percentage, 100);

          return (
            <li key={category.id}>
              <div className="flex items-center gap-2 text-sm">
                <CategoryIcon category={category} size="sm" />
                <span className="font-medium">{category.name}</span>
                <span className="ml-auto text-mist">
                  {formatCurrency(spent)} / {formatCurrency(budget)}
                </span>
              </div>

              <div
                role="progressbar"
                aria-label={`Presupuesto de ${category.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={barWidth}
                className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%`, backgroundColor: color }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />
              </div>

              <p className="mt-1 text-xs" style={{ color }}>
                {remaining >= 0
                  ? `Te quedan ${formatCurrency(remaining)} · ${percentage}% usado`
                  : `Te pasaste por ${formatCurrency(-remaining)}`}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}