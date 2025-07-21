import React, { memo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '../atoms';
import type { InputProps } from '../atoms';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showToggleButton?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = memo(({
  showToggleButton = true,
  className = '',
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!showToggleButton) {
    return <Input {...inputProps} type="password" className={className} />;
  }

  return (
    <div className="w-full">
      {inputProps.label && (
        <label 
          htmlFor={inputProps.id || inputProps.name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {inputProps.label}
          {inputProps.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Input
          {...inputProps}
          type={showPassword ? 'text' : 'password'}
          label={undefined} // Remove label from Input since we handle it above
          className={`pr-12 ${className}`}
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          type="button"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';