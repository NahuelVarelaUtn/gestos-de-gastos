import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/** Datos del usuario que le interesan a la UI. */
export interface AuthUser {
  id: string;
  email: string | null;
  isAnonymous: boolean;
}

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? null,
    isAnonymous: user.is_anonymous ?? false,
  };
}

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

/** Usuario de la sesión actual, o null si no hay sesión. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session ? toAuthUser(session.user) : null;
}

/** Registro, paso 1: envía un código de verificación al email. */
export async function requestEmailCode(email: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    throw new Error(`No se pudo enviar el código: ${error.message}`);
  }
}

/**
 * Registro, paso 2: verifica el código y define la contraseña.
 * El usuario conserva su id, y por lo tanto todos sus datos.
 */
export async function confirmEmailCode(
  email: string,
  code: string,
  password: string,
): Promise<AuthUser> {
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email_change',
  });

  if (verifyError) throw new Error('El código es incorrecto o ya venció.');

  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(`No se pudo guardar la contraseña: ${error.message}`);
  }
  return toAuthUser(data.user);
}

/** Ingreso de un usuario que ya tiene cuenta. */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error('Email o contraseña incorrectos.');
  return toAuthUser(data.user);
}

/** Cierra la sesión. La próxima carga creará un usuario anónimo nuevo. */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`No se pudo cerrar sesión: ${error.message}`);

  sessionPromise = null;
}