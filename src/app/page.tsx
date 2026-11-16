'use client';

import { useFinanceData } from '@/hooks/useFinanceData';
import { useFinanceStore } from '@/store/useFinanceStore';

export default function HomePage() {
  useFinanceData();

  const categories = useFinanceStore((state) => state.categories);
  const isLoading = useFinanceStore((state) => state.isLoading);
  const error = useFinanceStore((state) => state.error);

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold">Gestos de Gastos</h1>

      {isLoading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="mt-4">
        {categories.map((category) => (
          <li key={category.id}>
            {category.name} ({category.type})
          </li>
        ))}
      </ul>
    </main>
  );
}