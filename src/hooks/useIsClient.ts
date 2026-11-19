import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * false durante el render del servidor y la hidratación,
 * true en el navegador. Sirve para mostrar contenido que
 * depende del cliente (como la fecha actual) sin errores de hidratación.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // valor en el cliente
    () => false, // valor en el servidor
  );
}