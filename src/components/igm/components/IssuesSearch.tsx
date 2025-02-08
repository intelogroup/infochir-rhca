
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeSelector } from "@/components/index-medicus/search/DateRangeSelector";
import { DateRange } from "react-day-picker";
import type { SortOption } from "../constants/sortOptions";

interface IssuesSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  dateRange?: DateRange;
  setDateRange?: (range: DateRange | undefined) => void;
  sortOptions: { label: string; value: SortOption }[];
}

export const IssuesSearch = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  dateRange,
  setDateRange,
  sortOptions,
}: IssuesSearchProps) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
      <div className="grid gap-4 md:grid-cols-[1fr,auto,auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
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

        {setDateRange && (
          <DateRangeSelector
            date={dateRange}
            setDate={setDateRange}
          />
        )}
      </div>
    </div>
  );
};
