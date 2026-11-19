'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Si el usuario activó "reducir movimiento" en su sistema operativo,
 * Motion desactiva las animaciones de desplazamiento automáticamente.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}