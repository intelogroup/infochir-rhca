import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BaseSortOption } from "@/types/sort";

interface SearchAndSortProps<T extends BaseSortOption> {
  searchTerm: string;
  sortBy: T["value"];
  onSearchChange: (value: string) => void;
  onSortChange: (value: T["value"]) => void;
  sortOptions: readonly T[];
  disabled?: boolean;
}

export function SearchAndSort<T extends BaseSortOption>({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange,
  sortOptions,
  disabled
}: SearchAndSortProps<T>) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          disabled={disabled}
        />
      </div>
      <Select 
        value={sortBy} 
        onValueChange={onSortChange}
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
}