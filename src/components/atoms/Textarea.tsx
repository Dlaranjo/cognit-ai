import React, { memo } from 'react';
import { useAutoResize } from '../../hooks';

export interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxRows?: number;
  autoResize?: boolean;
  className?: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

export const Textarea: React.FC<TextareaProps> = memo(({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  rows = 3,
  maxRows,
  autoResize = false,
  className = '',
  error = false,
  errorMessage,
  label,
  id,
  name,
  required = false,
  onFocus,
  onBlur,
  onKeyDown,
  resize = 'vertical',
  size = 'md',
}) => {
  // Use custom hook for auto-resize functionality
  const textareaRef = useAutoResize({
    value: value || '',
    enabled: autoResize,
    minRows: rows,
    maxRows
  });

  const baseClasses = `
    w-full border border-gray-300 rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
    placeholder-gray-500 bg-white
  `;

  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:ring-orange-500';

  const disabledClasses = disabled 
    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
    : 'bg-white text-gray-900';

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={autoResize ? undefined : rows}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${resizeClasses[autoResize ? 'none' : resize]}
          ${errorClasses}
          ${disabledClasses}
          ${className}
        `.trim()}
      />
      
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';