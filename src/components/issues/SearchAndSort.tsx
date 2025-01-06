import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { SortOption } from "@/types/sortOptions";

interface SearchAndSortProps {
  searchTerm: string;
  sortBy: string;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
  sortOptions: { value: SortOption; label: string }[];
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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 px-2 sm:px-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher une édition..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 h-9 sm:h-10 text-sm"
          disabled={disabled}
        />
      </div>
      <Select
        value={sortBy}
        onValueChange={onSort}
        disabled={disabled}
      >
        <SelectTrigger className="w-full sm:w-[180px] h-9 sm:h-10 text-sm">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};