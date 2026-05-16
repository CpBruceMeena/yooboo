'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'error';
  duration?: number;
  onDismiss?: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  const typeStyles: Record<string, string> = {
    info: 'bg-blue/20 border-blue text-blue',
    success: 'bg-green/20 border-green text-green',
    error: 'bg-danger/20 border-danger text-danger',
  };

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        px-6 py-3 rounded-xl border-2 font-semibold text-sm
        animate-discard-burst
        ${typeStyles[type] ?? typeStyles.info}
      `}
    >
      {message}
    </div>
  );
}