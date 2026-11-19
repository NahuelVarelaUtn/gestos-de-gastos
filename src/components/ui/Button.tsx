'use client';

import { motion, type HTMLMotionProps } from 'motion/react';

type ButtonVariant = 'primary' | 'secondary';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-ocean text-white hover:bg-cobalt',
  secondary: 'border border-white/15 text-glacier hover:bg-white/10',
};

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
}

/** Botón con efecto de compresión al presionarlo. */
export function Button({
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`w-full rounded-xl px-4 py-3 font-semibold disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    />
  );
}