'use client';

import { addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFinanceStore } from '@/store/useFinanceStore';

const BUTTON_CLASS =
  'rounded-lg px-4 py-2 text-xl text-mist transition-colors hover:bg-white/10 hover:text-glacier';

export function MonthFilter() {
  const filter = useFinanceStore((state) => state.filter);
  const setFilter = useFinanceStore((state) => state.setFilter);

  // En Date los meses van de 0 a 11; en nuestro filtro, de 1 a 12.
  const currentDate = new Date(filter.year, filter.month - 1, 1);

  function shiftMonth(offset: number) {
    // addMonths resuelve solo el cambio de año (dic -> ene).
    const next = addMonths(currentDate, offset);
    setFilter({ month: next.getMonth() + 1, year: next.getFullYear() });
  }

  return (
    <nav
      aria-label="Filtro por mes"
      className="glass-card flex items-center justify-between p-2"
    >
      <button
        type="button"
        onClick={() => shiftMonth(-1)}
        aria-label="Mes anterior"
        className={BUTTON_CLASS}
      >
        ‹
      </button>
      <p className="font-semibold capitalize">
        {format(currentDate, 'MMMM yyyy', { locale: es })}
      </p>
      <button
        type="button"
        onClick={() => shiftMonth(1)}
        aria-label="Mes siguiente"
        className={BUTTON_CLASS}
      >
        ›
      </button>
    </nav>
  );
}