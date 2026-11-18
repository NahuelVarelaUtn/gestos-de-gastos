'use client';

import { useState, type SyntheticEvent } from 'react';
import {
  confirmEmailCode,
  requestEmailCode,
  signIn,
  signOut,
} from '@/services/auth.service';
import { useFinanceStore } from '@/store/useFinanceStore';

type Mode = 'register' | 'login';
type RegisterStep = 'email' | 'code';

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base ' +
  'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

const PRIMARY_BUTTON_CLASS =
  'w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white ' +
  'hover:bg-indigo-700 disabled:opacity-50';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error inesperado';

export function AccountPanel() {
  const user = useFinanceStore((state) => state.user);
  const setUser = useFinanceStore((state) => state.setUser);

  const [mode, setMode] = useState<Mode>('register');
  const [step, setStep] = useState<RegisterStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Ejecuta una acción manejando la carga y los errores en un solo lugar. */
  async function run(action: () => Promise<void>) {
    setIsSubmitting(true);
    setMessage(null);
    try {
      await action();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(newMode: Mode) {
    setMode(newMode);
    setStep('email');
    setMessage(null);
  }

  function handleRequestCode(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await requestEmailCode(email.trim());
      setStep('code');
    });
  }

  function handleConfirmCode(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      // Mismo usuario, mismo id: las transacciones se conservan
      // y no hace falta recargar nada.
      setUser(await confirmEmailCode(email.trim(), code.trim(), password));
    });
  }

  function handleSignIn(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await signIn(email.trim(), password);
      // Cambió el usuario: recargamos para traer SUS datos.
      window.location.reload();
    });
  }

  function handleSignOut() {
    void run(async () => {
      await signOut();
      window.location.reload();
    });
  }

  // Todavía cargando la sesión.
  if (!user) return null;

  // --- Usuario con cuenta ---
  if (!user.isAnonymous) {
    return (
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="truncate text-slate-600">
          Sesión: <strong className="text-slate-900">{user.email}</strong>
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSubmitting}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:bg-slate-100"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  // --- Usuario anónimo ---
  return (
    <details className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <summary className="cursor-pointer font-semibold text-indigo-900">
        Guardá tus datos: creá una cuenta o ingresá
      </summary>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-2" role="tablist">
          {(['register', 'login'] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={mode === option}
              onClick={() => changeMode(option)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                mode === option
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700'
              }`}
            >
              {option === 'register' ? 'Crear cuenta' : 'Ya tengo cuenta'}
            </button>
          ))}
        </div>

        {mode === 'register' && step === 'email' && (
          <form onSubmit={handleRequestCode} className="space-y-3">
            <p className="text-sm text-slate-600">
              Tus transacciones actuales se guardan en la cuenta nueva.
            </p>
            <label htmlFor="register-email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={INPUT_CLASS}
            />
            <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
              {isSubmitting ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {mode === 'register' && step === 'code' && (
          <form onSubmit={handleConfirmCode} className="space-y-3">
            <p className="text-sm text-slate-600">
              Te enviamos un código a <strong>{email}</strong>.
            </p>
<label htmlFor="code" className="block text-sm font-medium">
  Código de verificación
</label>
<input
  id="code"
  type="text"
  required
  inputMode="numeric"
  autoComplete="one-time-code"
  // Supabase permite configurar códigos de 6 a 10 dígitos.
  pattern="\d{6,10}"
  maxLength={10}
  value={code}
  onChange={(event) => setCode(event.target.value)}
  className={INPUT_CLASS}
/>
            <label htmlFor="new-password" className="block text-sm font-medium">
              Contraseña (mínimo 6 caracteres)
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={INPUT_CLASS}
            />
            <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
              {isSubmitting ? 'Verificando...' : 'Crear cuenta'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-indigo-700 hover:underline"
            >
              Usar otro email
            </button>
          </form>
        )}

        {mode === 'login' && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <p className="text-sm text-slate-600">
              Las transacciones cargadas en esta sesión sin cuenta no se
              transfieren.
            </p>
            <label htmlFor="login-email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={INPUT_CLASS}
            />
            <label htmlFor="login-password" className="block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={INPUT_CLASS}
            />
            <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}

        {message && (
          <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {message}
          </p>
        )}
      </div>
    </details>
  );
}