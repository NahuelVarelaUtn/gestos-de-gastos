import { useSyncExternalStore } from 'react';

// No hay nada a lo que suscribirse: el valor nunca cambia después de montar.
const subscribe = () => () => {};

/**
 * Devuelve false en el servidor (y durante la hidratación)
 * y true una vez que el componente ya vive en el navegador.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // valor en el navegador
    () => false, // valor en el servidor
  );
}