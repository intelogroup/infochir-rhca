import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SearchInput } from "./search/SearchInput";
import { FilterAccordion } from "./search/FilterAccordion";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedAuthors: string[];
  setSelectedAuthors: (authors: string[]) => void;
  titleFilter: string;
  setTitleFilter: (value: string) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSearch: () => void;
  categories: string[];
  sources: string[];
  availableTags: string[];
  availableAuthors: string[];
  articleStats: {
    total: number;
    filtered: number;
    sources: Record<string, number>;
    categories: Record<string, number>;
    authors: Record<string, number>;
  };
}

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  selectedTags,
  setSelectedTags,
  selectedAuthors,
  setSelectedAuthors,
  titleFilter,
  setTitleFilter,
  date,
  setDate,
  categories,
  sources,
  availableTags,
  availableAuthors,
  articleStats
}: SearchBarProps) => {
  const hasActiveFilters = Boolean(
    searchTerm || 
    selectedCategory || 
    selectedSource || 
    selectedTags.length > 0 || 
    selectedAuthors.length > 0 ||
    titleFilter ||
    date
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSource("");
    setSelectedTags([]);
    setSelectedAuthors([]);
    setTitleFilter("");
    setDate(undefined);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="search-filters">
          <div className="flex items-center justify-between gap-4">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <AccordionTrigger className="flex-none">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres avancés
              </Button>
            </AccordionTrigger>
          </div>

          <AccordionContent>
            <FilterAccordion
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              selectedAuthors={selectedAuthors}
              setSelectedAuthors={setSelectedAuthors}
              titleFilter={titleFilter}
              setTitleFilter={setTitleFilter}
              date={date}
              setDate={setDate}
              categories={categories}
              sources={sources}
              availableTags={availableTags}
              availableAuthors={availableAuthors}
              articleStats={articleStats}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};