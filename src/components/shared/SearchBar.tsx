
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { createLogger } from '@/lib/error-logger';

const logger = createLogger('SearchBar');

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  debounceTime?: number;
}

export const SearchBar = ({
  placeholder = 'Rechercher...',
  value,
  onChange,
  onSearch,
  className = '',
  autoFocus = false,
  debounceTime = 300
}: SearchBarProps) => {
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear any existing timeout
    if (searchTimeout) {
      window.clearTimeout(searchTimeout);
    }
    
    // Set a new timeout
    if (onSearch) {
      const timeoutId = window.setTimeout(() => {
        onSearch(newValue);
      }, debounceTime);
      
      setSearchTimeout(timeoutId);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      if (searchTimeout) {
        window.clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        className="pl-10 pr-10 bg-background border-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        aria-label="Recherche"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};
