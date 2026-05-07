import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

const sizeClass = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        className={`relative w-full ${sizeClass[size]} bg-themeWhite dark:bg-themeBlack shadow-xl border-2 border-themeBlack dark:border-themeWhite flex flex-col max-h-[90vh]`}
      >
        {(title || description) && (
          <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-themeBlack dark:border-themeWhite">
            <div>
              {title ? (
                <h2 className="text-lg font-semibold text-themeBlack dark:text-themeWhite">{title}</h2>
              ) : null}
              {description ? (
                <p className="text-sm text-themeBlack/60 dark:text-themeWhite/60 mt-0.5">{description}</p>
              ) : null}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-themeBlack/60 dark:text-themeWhite/60"
            >
              <X className="w-5 h-5" />
            </button>
          </header>
        )}
        <div className="px-6 py-4 overflow-y-auto">{children}</div>
        {footer ? (
          <footer className="px-6 py-3 border-t border-themeBlack dark:border-themeWhite flex justify-end gap-2">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
