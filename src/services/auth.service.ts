import { supabase } from '@/lib/supabase';

// Guardamos la promesa para que dos llamadas simultáneas
// no creen dos usuarios anónimos distintos.
let sessionPromise: Promise<void> | null = null;

async function createSessionIfMissing(): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return;

  const { error } = await supabase.auth.signInAnonymously();
  if (error) throw new Error(`No se pudo iniciar sesión: ${error.message}`);
}

/** Garantiza que exista una sesión antes de consultar la base. */
export function ensureSession(): Promise<void> {
  sessionPromise ??= createSessionIfMissing();
  return sessionPromise;
}