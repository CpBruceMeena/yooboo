'use client';

interface StackMeterProps {
  value: number;
}

export default function StackMeter({ value }: StackMeterProps) {
  if (value <= 0) return null;

  const glowColor =
    value <= 6
      ? 'shadow-[0_0_15px_rgba(243,199,66,0.6)] border-yellow'
      : value <= 15
        ? 'shadow-[0_0_20px_rgba(255,165,0,0.7)] border-orange-500'
        : 'shadow-[0_0_30px_rgba(255,0,0,0.8)] border-red animate-stack-pulse';

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border-2
        bg-bgTertiary text-textPrimary font-bold text-lg
        ${glowColor}
      `}
    >
      <span className="text-danger">⚡</span>
      <span>STACK: {value}</span>
    </div>
  );
}