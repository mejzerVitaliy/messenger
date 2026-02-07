import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from 'shared/lib';

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-input outline-none transition-all duration-200',
      'placeholder:text-slate-400',
      'hover:border-slate-300',
      'focus:border-brand-500 focus:shadow-input-focus',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...rest}
  />
));

Input.displayName = 'Input';
