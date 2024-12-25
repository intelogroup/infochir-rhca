import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { SearchInput } from "./search/SearchInput";
import { FilterSelects } from "./search/FilterSelects";

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
    <div className="bg-white/95 backdrop-blur-xs rounded-xl p-6 border border-gray-100">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SearchInput 
          searchTerm={searchTerm} 
          onChange={setSearchTerm} 
        />

        <FilterSelects
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          categories={categories}
          sources={sources}
        />

        <DatePickerWithRange date={date} setDate={setDate} />

        <div className="lg:col-span-4">
          <Button 
            onClick={onSearch} 
            className="w-full gap-2"
            aria-label="Lancer la recherche"
          >
            <Search className="h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
};