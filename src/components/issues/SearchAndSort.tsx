import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchAndSortProps {
  searchTerm: string;
  sortBy: string;
  onSearch: (value: string) => void;
  onSort: (value: string) => void;
}

export const SearchAndSort = ({ searchTerm, sortBy, onSearch, onSort }: SearchAndSortProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher des volumes..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      <Select value={sortBy} onValueChange={onSort}>
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Plus récents</SelectItem>
          <SelectItem value="year">Année</SelectItem>
          <SelectItem value="month">Mois</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};