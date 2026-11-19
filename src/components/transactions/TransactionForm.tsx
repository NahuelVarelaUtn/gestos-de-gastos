'use client';

import { motion } from 'motion/react';
import { useState, type SyntheticEvent } from 'react';
import { CategoryPicker } from '@/components/transactions/CategoryPicker';
import { Button } from '@/components/ui/Button';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { TransactionType } from '@/types';
import { todayISO } from '@/utils/formatters';

// text-base (16px) evita que iOS haga zoom al enfocar el campo.
const INPUT_CLASS =
  'w-full rounded-xl border border-white/15 bg-abyss/60 px-3 py-2 text-base ' +
  'focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30';

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Gasto' },
  { value: 'income', label: 'Ingreso' },
];

interface TransactionFormProps {
  /** Se llama al guardar o cancelar, para cerrar el modal. */
  onDone: () => void;
}

export function TransactionForm({ onDone }: TransactionFormProps) {
  const categories = useFinanceStore((state) => state.categories);
  const editingTransaction = useFinanceStore(
    (state) => state.editingTransaction,
  );
  const error = useFinanceStore((state) => state.error);
  const { create, update } = useTransactionActions();

  const isEditing = editingTransaction !== null;

  // Si hay una transacción en edición, sus datos son los valores iniciales.
  const [type, setType] = useState<TransactionType>(
    editingTransaction?.category.type ?? 'expense',
  );
  const [amount, setAmount] = useState(
    editingTransaction ? String(editingTransaction.amount) : '',
  );
  const [categoryId, setCategoryId] = useState(
    editingTransaction?.category.id ?? '',
  );
  const [date, setDate] = useState(editingTransaction?.date ?? todayISO());
  const [description, setDescription] = useState(
    editingTransaction?.description ?? '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = categories.filter(
    (category) => category.type === type,
  );

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    setCategoryId(''); // La categoría anterior ya no es válida.
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);
    if (!categoryId || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const input = {
      amount: parsedAmount,
      description: description.trim() || null,
      date,
      category_id: categoryId,
    };

    setIsSubmitting(true);
    const wasSaved = editingTransaction
      ? await update(editingTransaction.id, input)
      : await create(input);
    setIsSubmitting(false);

    if (wasSaved) onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Selector segmentado con indicador que se desliza */}
      <fieldset className="grid grid-cols-2 gap-1 rounded-xl bg-abyss/60 p-1">
        <legend className="sr-only">Tipo de transacción</legend>
        {TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="relative cursor-pointer rounded-lg px-3 py-2 text-center font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean"
          >
            {type === option.value && (
              <motion.span
                layoutId="type-indicator"
                className="absolute inset-0 rounded-lg bg-ocean"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <input
              type="radio"
              name="type"
              value={option.value}
              checked={type === option.value}
              onChange={() => handleTypeChange(option.value)}
              className="sr-only"
            />
            <span className="relative">{option.label}</span>
          </label>
        ))}
      </fieldset>

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium">
          Monto
        </label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          required
          placeholder="0,00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <CategoryPicker
        categories={availableCategories}
        value={categoryId}
        onChange={setCategoryId}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            Fecha
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Descripción (opcional)
          </label>
          <input
            id="description"
            type="text"
            maxLength={200}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

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
          {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar'}
        </Button>
      </div>
    </form>
  );
}