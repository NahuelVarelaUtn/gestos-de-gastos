import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Se crea una sola vez y se reutiliza: es costoso de instanciar.
const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

/** 1234.5 -> "$ 1.234,50" */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/** '2026-11-16' -> "16 nov 2026" */
export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMM yyyy', { locale: es });
}

/** Fecha de hoy en el formato que usan <input type="date"> y Postgres. */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}