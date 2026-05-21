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
  primary: 'bg-gradient-to-r from-gold to-goldGlow text-bgWarm font-semibold shadow-lg shadow-gold/20 hover:shadow-gold/35',
  secondary: 'bg-[#130E0A]/80 hover:bg-[#130E0A] text-cream border border-gold/20 hover:border-gold/40',
  danger: 'bg-gradient-to-r from-crimson to-danger text-white font-semibold shadow-lg shadow-crimson/20',
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