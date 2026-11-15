import styles from './page.module.scss';

export default function HomePage() {
  return (
    <main className="min-h-screen p-4">
      {/* Clase de Sass (module) + utilidad de Tailwind en el mismo elemento */}
      <h1 className={`${styles.title} font-bold`}>Gestos de Gastos</h1>
    </main>
  );
}