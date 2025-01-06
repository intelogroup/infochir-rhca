import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { SortOption } from "@/types/sortOptions";
import { motion } from "framer-motion";

interface SearchAndSortProps {
  searchTerm: string;
  sortBy: SortOption;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
  sortOptions: { value: SortOption; label: string }[];
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
  dateRange,
  onDateRangeChange,
  selectedCategories,
  onCategoryChange,
  availableCategories = [],
  disabled = false,
}: SearchAndSortProps) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher un numéro..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 bg-white"
          disabled={disabled}
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-4">
        {onDateRangeChange && (
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Filtrer par date"
            disabled={disabled}
            className="min-w-[240px]"
          />
        )}

        <Select
          value={sortBy}
          onValueChange={(value) => onSort(value as SortOption)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Trier par..." />
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
    </motion.div>
  );
};