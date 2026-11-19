'use client';

import { motion } from 'motion/react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { Category } from '@/types';

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
}

/** Selector de categorías en tarjetas con ícono (reemplaza al <select>). */
export function CategoryPicker({
  categories,
  value,
  onChange,
}: CategoryPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Categoría</legend>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {categories.map((category) => {
          const isSelected = category.id === value;

          return (
            <motion.label
              key={category.id}
              whileTap={{ scale: 0.94 }}
              className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-2 text-center text-xs font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean ${
                isSelected ? 'bg-white/10' : 'border-white/10 hover:bg-white/5'
              }`}
              style={isSelected ? { borderColor: category.color } : undefined}
            >
              {/* Radio real oculto: mantiene el teclado y la validación */}
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={isSelected}
                onChange={() => onChange(category.id)}
                required
                className="sr-only"
              />
              <CategoryIcon category={category} size="sm" />
              <span className="w-full truncate">{category.name}</span>
            </motion.label>
          );
        })}
      </div>
    </fieldset>
  );
}