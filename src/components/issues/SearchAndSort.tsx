import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { SortOption, SortOptionType } from "@/types/sortOptions";
import { cn } from "@/lib/utils";

export interface SearchAndSortProps {
  searchTerm: string;
  sortBy: SortOption;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
  sortOptions: readonly SortOptionType[];
  className?: string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  availableCategories?: string[];
  disabled?: boolean;
}

export const SearchAndSort = ({
  searchTerm,
  sortBy,
  onSearch,
  onSort,
  sortOptions,
  className,
  dateRange,
  onDateRangeChange,
  disabled = false,
}: SearchAndSortProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>
      
      <div className="flex flex-wrap sm:flex-nowrap gap-4">
        {onDateRangeChange && (
          <DatePickerWithRange
            date={dateRange}
            setDate={onDateRangeChange}
          />
        )}

        <Select value={sortBy} onValueChange={onSort} disabled={disabled}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white">
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
    </div>
  );
};