'use client';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-blue hover:bg-blue/80 text-white',
  secondary: 'bg-bgTertiary hover:bg-bgTertiary/80 text-textPrimary border border-textMuted/20',
  danger: 'bg-danger hover:bg-danger/80 text-white',
};

export default function Button({ variant = 'primary', children, onClick, disabled, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-150
        ${variantStyles[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}