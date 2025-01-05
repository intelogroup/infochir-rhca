import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortOption } from "@/components/igm/constants/sortOptions";

interface SortOptionType {
  value: string;
  label: string;
}

interface SearchAndSortProps {
  searchTerm: string;
  sortBy: string;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
  sortOptions?: SortOptionType[];
  disabled?: boolean;
}

export const SearchAndSort = ({
  searchTerm,
  sortBy,
  onSearch,
  onSort,
  sortOptions = [],
  disabled = false
}: SearchAndSortProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>
      <Select
        value={sortBy}
        onValueChange={onSort}
        disabled={disabled}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};