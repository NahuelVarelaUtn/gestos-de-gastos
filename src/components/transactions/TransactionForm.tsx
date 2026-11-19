'use client';

import { useState, type SyntheticEvent } from 'react';
import {
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from '@/components/ui/classNames';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { TransactionType } from '@/types';
import { todayISO } from '@/utils/formatters';

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Gasto' },
  { value: 'income', label: 'Ingreso' },
];

export function TransactionForm() {
  const categories = useFinanceStore((state) => state.categories);
  const editingTransaction = useFinanceStore(
    (state) => state.editingTransaction,
  );
  const setEditingTransaction = useFinanceStore(
    (state) => state.setEditingTransaction,
  );
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

  // Solo mostramos las categorías del tipo elegido.
  const availableCategories = categories.filter(
    (category) => category.type === type,
  );

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    setCategoryId(''); // La categoría anterior ya no es válida.
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); // Evita que el navegador recargue la página.

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

    if (!wasSaved) return;

    if (editingTransaction) {
      setEditingTransaction(null); // Salir del modo edición.
    } else {
      setAmount('');
      setDescription('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 p-4">
      <h2 className="text-lg font-semibold">
        {isEditing ? 'Editar transacción' : 'Nueva transacción'}
      </h2>

      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="sr-only">Tipo de transacción</legend>
        {TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-center font-medium transition-colors ${
              type === option.value
                ? 'border-ocean bg-ocean text-white'
                : 'border-white/15 bg-white/5 text-glacier hover:bg-white/10'
            }`}
          >
            <input
              type="radio"
              name="type"
              value={option.value}
              checked={type === option.value}
              onChange={() => handleTypeChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
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

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Categoría
          </label>
          <select
            id="category"
            required
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={INPUT_CLASS}
          >
            <option value="" disabled>
              Elegí una categoría
            </option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

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

      <div className="flex gap-2">
        {isEditing && (
          <button
            type="button"
            onClick={() => setEditingTransaction(null)}
            className={SECONDARY_BUTTON_CLASS}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={PRIMARY_BUTTON_CLASS}
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar'}
        </button>
      </div>
    </form>
  );
}