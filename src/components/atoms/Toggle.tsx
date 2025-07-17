import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  label?: string;
  description?: string;
  id?: string;
}

export const Toggle = React.memo<ToggleProps>(
  ({
    checked,
    onChange,
    disabled = false,
    size = 'md',
    color = 'primary',
    label,
    description,
    id,
  }) => {
    const sizeClasses = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: checked ? 'translate-x-4' : 'translate-x-0.5',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: checked ? 'translate-x-5' : 'translate-x-0.5',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: checked ? 'translate-x-7' : 'translate-x-0.5',
      },
    };

    const colorClasses = {
      primary: checked ? 'bg-orange-600' : 'bg-gray-200',
      success: checked ? 'bg-green-600' : 'bg-gray-200',
      warning: checked ? 'bg-yellow-600' : 'bg-gray-200',
      error: checked ? 'bg-red-600' : 'bg-gray-200',
    };

    const { track, thumb, translate } = sizeClasses[size];

    const handleToggle = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const toggleElement = (
      <button
        type="button"
        className={`
        relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
        ${track}
        ${disabled ? 'opacity-50 cursor-not-allowed' : colorClasses[color]}
      `}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        onClick={handleToggle}
        id={id}
      >
        <span
          className={`
          ${thumb}
          ${translate}
          pointer-events-none relative inline-block rounded-full bg-white shadow transform ring-0 
          transition duration-200 ease-in-out
        `}
        >
          <span
            className={`
            absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in-out
            ${checked ? 'opacity-0' : 'opacity-100'}
          `}
            aria-hidden="true"
          >
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              viewBox="0 0 12 12"
            >
              <path
                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
            className={`
            absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in-out
            ${checked ? 'opacity-100' : 'opacity-0'}
          `}
            aria-hidden="true"
          >
            <svg
              className="w-3 h-3 text-orange-600"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
            </svg>
          </span>
        </span>
      </button>
    );

    if (label || description) {
      return (
        <div className="flex items-start space-x-3">
          {toggleElement}
          <div className="flex-1">
            {label && (
              <label
                htmlFor={id}
                className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'} cursor-pointer`}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      );
    }

    return toggleElement;
  }
);
