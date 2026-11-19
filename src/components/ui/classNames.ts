/** Clases compartidas de formularios, para no repetirlas en cada componente. */

// text-base (16px) evita que iOS haga zoom al enfocar el campo.
// [color-scheme:dark] pone en tema oscuro los controles nativos (calendario, select).
export const INPUT_CLASS =
  'w-full rounded-lg border border-white/15 bg-abyss/60 px-3 py-2 text-base text-glacier ' +
  'placeholder:text-mist/60 [color-scheme:dark] ' +
  'focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30';

export const PRIMARY_BUTTON_CLASS =
  'w-full rounded-lg bg-ocean px-4 py-3 font-semibold text-white ' +
  'transition-colors hover:bg-cobalt disabled:opacity-50';

export const SECONDARY_BUTTON_CLASS =
  'w-full rounded-lg border border-white/15 px-4 py-3 font-semibold text-glacier ' +
  'transition-colors hover:bg-white/10';