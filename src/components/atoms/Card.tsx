import React, { memo } from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  disabled?: boolean;
  background?: boolean;
}

export const Card: React.FC<CardProps> = memo(({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = true,
  disabled = false,
  background = true,
}) => {
  const variantClasses = background ? {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-transparent border-2 border-gray-300',
    elevated: 'bg-white shadow-md border border-gray-100',
  } : {
    default: '',
    outlined: '',
    elevated: 'shadow-md',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const baseClasses = 'rounded-lg transition-all duration-200';
  
  const interactionClasses = onClick && !disabled
    ? `cursor-pointer ${hover ? 'hover:shadow-md hover:scale-[1.02]' : ''} active:scale-[0.98]`
    : '';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${interactionClasses}
        ${disabledClasses}
        ${className}
      `.trim()}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';