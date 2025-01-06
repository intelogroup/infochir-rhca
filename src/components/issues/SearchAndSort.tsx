import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { SortOption, SortOptionType } from "@/types/sortOptions";

interface SearchAndSortProps {
  searchTerm: string;
  sortBy: string;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
  sortOptions: readonly SortOptionType[];
  disabled?: boolean;
}

export const SearchAndSort = ({
  searchTerm,
  sortBy,
  onSearch,
  onSort,
  sortOptions,
  disabled = false,
}: SearchAndSortProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" aria-hidden="true" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher une édition..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 h-11 text-base bg-white border-gray-200 focus:border-ocean focus:ring-ocean shadow-sm"
          disabled={disabled}
          aria-label="Rechercher une édition"
        />
      </div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <Filter className="h-4 w-4" aria-hidden="true" />
        </div>
        <Select
          value={sortBy}
          onValueChange={onSort}
          disabled={disabled}
        >
          <SelectTrigger 
            className="w-full sm:w-[200px] h-11 text-base bg-white border-gray-200 pl-10 shadow-sm"
            aria-label="Trier les éditions"
          >
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-base"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};