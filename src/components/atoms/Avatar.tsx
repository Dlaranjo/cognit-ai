import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackIcon?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const Avatar = React.memo<AvatarProps>(
  ({ src, alt, name, size = 'md', className = '', fallbackIcon = true }) => {
    const [imageError, setImageError] = React.useState(false);

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const baseClasses =
      'inline-flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 font-medium overflow-hidden';

    const classes = [baseClasses, sizeClasses[size], className].join(' ');

    const handleImageError = () => {
      setImageError(true);
    };

    const renderFallback = () => {
      if (name && !fallbackIcon) {
        return <span className="font-medium">{getInitials(name)}</span>;
      }

      if (fallbackIcon) {
        return <User className={iconSizeClasses[size]} />;
      }

      return (
        <span className="font-medium">{name ? getInitials(name) : '?'}</span>
      );
    };

    if (src && !imageError) {
      return (
        <div className={classes}>
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
      );
    }

    return <div className={classes}>{renderFallback()}</div>;
  }
);

export default Avatar;
