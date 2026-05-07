import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-12 h-12',
} as const;

export function Spinner({ size = 'md', label, className = '' }: SpinnerProps) {
  return (
    <div className={`flex items-center gap-2 text-themeBlack/60 dark:text-themeWhite/60 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin`} />
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}

export function FullPageSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}
