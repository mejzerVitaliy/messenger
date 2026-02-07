import { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from 'shared/lib';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type?: 'button' | 'submit';
  variant?: Variant;
  isLoading?: boolean;
  children: ReactNode;
};

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gradient-brand text-white hover:opacity-90 active:opacity-80',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
};

const baseStyles =
  'rounded-xl px-5 py-3 text-sm font-semibold shadow-sm outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

export const Button = ({
  variant = 'primary',
  isLoading = false,
  type = 'button',
  children,
  className,
  disabled,
  ...rest
}: Props) => {
  const styles = cn(baseStyles, variantStyles[variant], className);
  const isDisabled = disabled || isLoading;
  const content = isLoading ? <Spinner /> : children;

  if (type === 'submit') {
    return (
      <button type="submit" disabled={isDisabled} className={styles} {...rest}>
        {content}
      </button>
    );
  }

  return (
    <button type="button" disabled={isDisabled} className={styles} {...rest}>
      {content}
    </button>
  );
};

const Spinner = () => (
  <svg
    className="mx-auto h-5 w-5 animate-spin text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);
