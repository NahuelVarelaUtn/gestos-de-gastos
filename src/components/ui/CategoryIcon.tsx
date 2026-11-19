import { createElement } from 'react';
import { getCategoryIcon } from '@/lib/categoryIcons';
import type { Category } from '@/types';

interface CategoryIconProps {
  category: Pick<Category, 'icon' | 'color'>;
  size?: 'sm' | 'md';
}

/** Ícono de la categoría dentro de un círculo de su color. */
export function CategoryIcon({ category, size = 'md' }: CategoryIconProps) {
  const boxSize = size === 'sm' ? 'size-8' : 'size-10';

  return (
    <span
      aria-hidden="true"
      className={`flex ${boxSize} shrink-0 items-center justify-center rounded-full`}
      // El color viene de la base: Tailwind no puede generar clases en tiempo
      // de ejecución, así que usamos estilos en línea. "26" = 15% de opacidad.
      style={{ backgroundColor: `${category.color}26`, color: category.color }}
    >
      {createElement(getCategoryIcon(category.icon), {
        className: 'size-1/2',
        strokeWidth: 2,
      })}
    </span>
  );
}