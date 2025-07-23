import React from 'react';
import { Search, X } from 'lucide-react';
import { Input, Button } from '../atoms';

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
}

export const SearchBar = React.memo<SearchBarProps>(
  ({
    value = '',
    onChange,
    onClear,
    onSubmit,
    placeholder = 'Buscar...',
    disabled = false,
    className = '',
    size = 'md',
    showClearButton = true,
  }) => {
    const [internalValue, setInternalValue] = React.useState(value);

    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleClear = () => {
      setInternalValue('');
      onChange?.('');
      onClear?.();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(internalValue);
    };

    const hasValue = internalValue.length > 0;

    return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-neutral-400" />
          </div>

          <Input
            type="search"
            value={internalValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            className="pl-10 pr-10"
          />

          {showClearButton && hasValue && !disabled && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                type="button"
                className="p-1 h-auto min-h-0 hover:bg-neutral-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </form>
    );
  }
);

export default SearchBar;
