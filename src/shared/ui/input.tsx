import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from 'shared/lib';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-input outline-none transition-all duration-200',
            'placeholder:text-slate-400',
            'hover:border-slate-300',
            'focus:border-brand-500 focus:shadow-input-focus',
            error && 'border-red-400 focus:border-red-500',
            className,
          )}
          {...rest}
        />
        {error && (
          <span className="text-xs font-medium text-red-500">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
