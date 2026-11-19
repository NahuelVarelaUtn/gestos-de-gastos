'use client';

import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingButtonProps {
  onClick: () => void;
}

/** Botón flotante (FAB) para crear una transacción. */
export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Nueva transacción"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-ocean text-white shadow-lg shadow-ocean/40 md:right-8 md:bottom-8"
    >
      <Plus className="size-7" />
    </motion.button>
  );
}