'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && onClose?.()}
    >
      <div className="bg-bgSecondary rounded-2xl border border-textMuted/10 shadow-2xl min-w-[320px] max-w-md">
        {title && (
          <div className="px-6 py-4 border-b border-textMuted/10">
            <h2 className="text-lg font-bold text-textPrimary">{title}</h2>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}