import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/20',
  outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-200',
  ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-200',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = memo(({
  variant,
  size,
  disabled = false,
  loading = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
});

export default Button;