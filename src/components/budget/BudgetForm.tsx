'use client';

import { useState, type SyntheticEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { updateCategoryBudget } from '@/services/categories.service';
import { useFinanceStore } from '@/store/useFinanceStore';

const INPUT_CLASS =
  'w-32 rounded-xl border border-white/15 bg-abyss/60 px-3 py-2 text-right text-base ' +
  'focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30';

interface BudgetFormProps {
  /** Se llama al guardar o cancelar, para cerrar el modal. */
  onDone: () => void;
}

export function BudgetForm({ onDone }: BudgetFormProps) {
  const categories = useFinanceStore((state) => state.categories);
  const updateCategory = useFinanceStore((state) => state.updateCategory);

  const expenseCategories = categories.filter(
    (category) => category.type === 'expense',
  );

  // Un valor por categoría, guardado como texto para permitir el campo vacío.
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      expenseCategories.map((category) => [
        category.id,
        category.monthly_budget?.toString() ?? '',
      ]),
    ),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // Solo enviamos las categorías que cambiaron.
    const changes = expenseCategories.flatMap((category) => {
      const raw = values[category.id]?.trim() ?? '';
      const budget = raw === '' ? null : Number(raw);
      return budget === category.monthly_budget
        ? []
        : [{ id: category.id, budget }];
    });

    const hasInvalidValue = changes.some(
      ({ budget }) => budget !== null && (!Number.isFinite(budget) || budget <= 0),
    );
    if (hasInvalidValue) {
      setError('Los presupuestos tienen que ser mayores a 0.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      // Todas las actualizaciones viajan en paralelo.
      const updated = await Promise.all(
        changes.map(({ id, budget }) => updateCategoryBudget(id, budget)),
      );
      updated.forEach(updateCategory);
      onDone();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Error inesperado',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-mist">
        Indicá cuánto querés gastar por mes en cada categoría. Dejá el campo
        vacío si no querés ponerle límite.
      </p>

      <ul className="space-y-2">
        {expenseCategories.map((category) => {
          const inputId = `budget-${category.id}`;

          return (
            <li key={category.id} className="flex items-center gap-3">
              <CategoryIcon category={category} size="sm" />
              <label htmlFor={inputId} className="flex-1 font-medium">
                {category.name}
              </label>
              <input
                id={inputId}
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="Sin límite"
                value={values[category.id] ?? ''}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [category.id]: event.target.value,
                  }))
                }
                className={INPUT_CLASS}
              />
            </li>
          );
        })}
      </ul>

      {error && (
        <p role="alert" className="rounded-xl bg-coral/10 p-3 text-sm text-coral">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}