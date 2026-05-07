import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
 hint?: string;
 leftIcon?: ReactNode;
}

const base =
 'block w-full border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-60 bg-white text-gray-900 border-gray-300 placeholder-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
 { label, error, hint, leftIcon, id, className = '', ...rest },
 ref,
) {
 const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

 return (
 <div className="space-y-1">
 {label ? (
 <label
 htmlFor={inputId}
 className="block text-sm font-medium text-themeBlack dark:text-themeWhite"
 >
 {label}
 </label>
 ) : null}
 <div className="relative">
 {leftIcon ? (
 <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
 {leftIcon}
 </span>
 ) : null}
 <input
 id={inputId}
 ref={ref}
 className={`${base} ${leftIcon ? 'pl-9' : ''} ${error ? 'border-red-400 focus:ring-red-500' : ''} ${className}`}
 aria-invalid={error ? true : undefined}
 {...rest}
 />
 </div>
 {error ? (
 <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
 ) : hint ? (
 <p className="text-xs text-gray-500 dark:text-themeWhite/60">{hint}</p>
 ) : null}
 </div>
 );
});
