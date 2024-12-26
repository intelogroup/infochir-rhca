import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSearch: () => void;
  categories: string[];
  sources: string[];
}

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  date,
  setDate,
  onSearch,
  categories,
  sources,
}: SearchBarProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher par titre, auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSource}>
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePickerWithRange date={date} setDate={setDate} />

        <div className="lg:col-span-4">
          <Button onClick={onSearch} className="w-full gap-2">
            <Search className="h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
};