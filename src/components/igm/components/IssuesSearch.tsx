
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface IssuesSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

export const IssuesSearch: React.FC<IssuesSearchProps> = ({
  onSearch,
  initialQuery = '',
  placeholder = 'Rechercher un numéro...',
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-16"
      />
      
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-10 top-0 h-full px-2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default IssuesSearch;
