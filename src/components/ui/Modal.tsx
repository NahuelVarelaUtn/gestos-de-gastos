'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Modal con efecto spring. En celular sube desde abajo
 * (bottom sheet); en desktop aparece centrado.
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    // Evita que la página de fondo se desplace con el modal abierto.
    document.body.style.overflow = 'hidden';

    // Limpieza: se ejecuta al cerrar el modal.
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="modal"
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4"
        >
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-abyss/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="glass-card relative max-h-[90dvh] w-full overflow-y-auto rounded-b-none bg-deep/90 p-5 md:max-w-lg md:rounded-b-[1.25rem] md:p-6"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <header className="mb-4 flex items-center justify-between">
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="rounded-lg p-1 text-mist hover:bg-white/10 hover:text-glacier"
              >
                <X className="size-5" />
              </button>
            </header>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}