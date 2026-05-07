import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: Variant;
 size?: Size;
 loading?: boolean;
 leftIcon?: ReactNode;
 rightIcon?: ReactNode;
 fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
 primary:
 'bg-accentBlue text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-blue-300',
 secondary:
 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus-visible:ring-gray-400',
 ghost:
 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
 danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
 outline:
 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
};

const sizeClasses: Record<Size, string> = {
 sm: 'h-8 px-3 text-sm',
 md: 'h-10 px-4 text-sm',
 lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
 {
 variant = 'primary',
 size = 'md',
 loading = false,
 leftIcon,
 rightIcon,
 fullWidth,
 className = '',
 disabled,
 children,
 type = 'button',
 ...rest
 },
 ref,
) {
 const base =
 'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed';

 return (
 <button
 ref={ref}
 type={type}
 disabled={disabled || loading}
 className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
 {...rest}
 >
 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
 {children}
 {!loading && rightIcon}
 </button>
 );
});
