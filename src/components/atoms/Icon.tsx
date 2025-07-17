import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
    | 'current';
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
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-neutral-500',
  current: 'text-current',
};

export const Icon = React.memo<IconProps>(
  ({ icon: IconComponent, size = 'md', color = 'current', className = '' }) => {
    const classes = [sizeClasses[size], colorClasses[color], className].join(
      ' '
    );

    return <IconComponent className={classes} />;
  }
);

export default Icon;
