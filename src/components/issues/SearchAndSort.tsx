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
}

export const SearchAndSort = ({ 
  searchTerm, 
  sortBy, 
  onSearch, 
  onSort,
  sortOptions = [
    { value: "latest", label: "Plus récents" },
    { value: "year", label: "Année" },
    { value: "month", label: "Mois" },
  ]
}: SearchAndSortProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher par titre, volume, numéro..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      <Select value={sortBy} onValueChange={onSort}>
        <SelectTrigger className="w-[180px] h-9">
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