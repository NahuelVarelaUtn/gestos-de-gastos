'use client';

import dynamic from 'next/dynamic';

// ssr: false -> el Dashboard no se renderiza en el servidor ni en el build.
// Depende de la sesión y de la fecha del usuario, que solo existen en el navegador.
const Dashboard = dynamic(
  () => import('@/components/Dashboard').then((module) => module.Dashboard),
  {
    ssr: false,
    // Esto sí se prerenderiza: se ve al instante mientras carga la app.
    loading: () => (
      <main className="mx-auto max-w-3xl p-4 md:p-8">
        <p className="text-mist">Cargando...</p>
      </main>
    ),
  },
);

export default function HomePage() {
  return <Dashboard />;
}