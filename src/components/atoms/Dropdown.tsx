import React, { memo, useRef, useEffect } from 'react';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = memo(({
  trigger,
  children,
  isOpen = false,
  onToggle,
  className = '',
  position = 'bottom-left',
  disabled = false,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen && onToggle) {
          onToggle(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  const handleTriggerClick = () => {
    if (!disabled && onToggle) {
      onToggle(!isOpen);
    }
  };

  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div 
        onClick={handleTriggerClick}
        className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-50 ${positionClasses[position]} bg-white border border-gray-200 rounded-lg shadow-lg min-w-max`}
        >
          {children}
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';