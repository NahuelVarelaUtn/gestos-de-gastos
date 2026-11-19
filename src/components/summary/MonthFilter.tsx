'use client';

import { addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsClient } from '@/hooks/useIsClient';
import { useFinanceStore } from '@/store/useFinanceStore';

const BUTTON_CLASS =
  'rounded-lg p-2 text-mist hover:bg-white/10 hover:text-glacier';

export function MonthFilter() {
  const filter = useFinanceStore((state) => state.filter);
  const setFilter = useFinanceStore((state) => state.setFilter);

  // false en el servidor y durante la hidratación; true en el navegador.
  const isClient = useIsClient();

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
        <ChevronLeft className="size-5" />
      </button>

      <p className="font-semibold capitalize">
        {isClient ? (
          format(currentDate, 'MMMM yyyy', { locale: es })
        ) : (
          // Placeholder del mismo tamaño mientras hidrata.
          <span className="inline-block h-5 w-32 animate-pulse rounded bg-white/10 align-middle" />
        )}
      </p>

      <button
        type="button"
        onClick={() => shiftMonth(1)}
        aria-label="Mes siguiente"
        className={BUTTON_CLASS}
      >
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
}