import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
 label?: string;
 error?: string;
}

const base =
 'block w-full border px-3 py-2 text-sm bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500';

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
 { label, error, id, className = '', rows = 3, ...rest },
 ref,
) {
 const inputId = id || (label ? `ta-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
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
 <textarea
 id={inputId}
 ref={ref}
 rows={rows}
 className={`${base} ${error ? 'border-red-400 focus:ring-red-500' : ''} ${className}`}
 {...rest}
 />
 {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
 </div>
 );
});
