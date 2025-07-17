import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'neutral' | 'current';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  neutral: 'text-neutral-500',
  current: 'text-current',
};

export const Spinner = React.memo<SpinnerProps>(
  ({ size = 'md', color = 'current', className = '' }) => {
    const classes = [
      'animate-spin',
      sizeClasses[size],
      colorClasses[color],
      className,
    ].join(' ');

    return <Loader2 className={classes} />;
  }
);

export default Spinner;
