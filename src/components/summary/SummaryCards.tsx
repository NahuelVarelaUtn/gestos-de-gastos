'use client';

import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { formatCurrency } from '@/utils/formatters';
import styles from './SummaryCards.module.scss';

export function SummaryCards() {
  const { generalSummary } = useFinanceSummary();

  const cards = [
    { label: 'Balance', value: generalSummary.balance, color: 'text-slate-900' },
    { label: 'Ingresos', value: generalSummary.income, color: 'text-emerald-600' },
    { label: 'Gastos', value: generalSummary.expenses, color: 'text-rose-600' },
  ];

  return (
    <section aria-label="Resumen financiero" className={styles.grid}>
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
    </section>
  );
}