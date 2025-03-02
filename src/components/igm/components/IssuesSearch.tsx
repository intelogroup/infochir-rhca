
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { RotateCcw, Search } from 'lucide-react';
import { sortOptions } from '../constants/sortOptions';

interface IssuesSearchProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export const IssuesSearch: React.FC<IssuesSearchProps> = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between mb-6">
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher par titre, numéro, auteurs..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sortOptions).map(([key, option]) => (
              <SelectItem key={key} value={key}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(searchTerm || sortBy !== 'date_desc') && (
          <Button variant="outline" size="icon" onClick={onReset} title="Réinitialiser les filtres">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default IssuesSearch;
