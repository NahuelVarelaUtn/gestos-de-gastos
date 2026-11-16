'use client';

import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { formatCurrency } from '@/utils/formatters';
import styles from './SummaryCards.module.scss';

export function SummaryCards() {
  const { generalSummary, monthlySummary } = useFinanceSummary();

  const cards = [
    { label: 'Balance del mes', value: monthlySummary.balance, color: 'text-slate-900' },
    { label: 'Ingresos del mes', value: monthlySummary.income, color: 'text-emerald-600' },
    { label: 'Gastos del mes', value: monthlySummary.expenses, color: 'text-rose-600' },
  ];

  return (
    <section aria-label="Resumen financiero" className="space-y-3">
      <div className={styles.grid}>
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-sm text-slate-500">{card.label}</h2>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.value)}
            </p>
          </article>
        ))}
      </div>

      <p className="text-right text-sm text-slate-500">
        Balance general:{' '}
        <strong className="text-slate-900">
          {formatCurrency(generalSummary.balance)}
        </strong>
      </p>
    </section>
  );
}