'use client';

import { motion } from 'motion/react';
import { useFinanceSummary } from '@/hooks/useFinanceSummary';
import { formatCurrency } from '@/utils/formatters';
import styles from './SummaryCards.module.scss';

export function SummaryCards() {
  const { generalSummary, monthlySummary } = useFinanceSummary();

  const cards = [
    { label: 'Balance del mes', value: monthlySummary.balance, color: 'text-glacier' },
    { label: 'Ingresos del mes', value: monthlySummary.income, color: 'text-aqua' },
    { label: 'Gastos del mes', value: monthlySummary.expenses, color: 'text-coral' },
  ];

  return (
    <section aria-label="Resumen financiero" className="space-y-3">
      <div className={styles.grid}>
        {cards.map((card) => (
          <motion.article
            key={card.label}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass-card p-4"
          >
            <h2 className="text-sm text-mist">{card.label}</h2>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.value)}
            </p>
          </motion.article>
        ))}
      </div>

      <p className="text-right text-sm text-mist">
        Balance general:{' '}
        <strong className="text-glacier">
          {formatCurrency(generalSummary.balance)}
        </strong>
      </p>
    </section>
  );
}