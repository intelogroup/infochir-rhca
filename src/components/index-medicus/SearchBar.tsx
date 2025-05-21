
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  disableSourceFilter?: boolean;
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
  articleStats,
  disableSourceFilter = false
}: SearchBarProps) => {
  const isMobile = useIsMobile();
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
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="search-filters" className="border-none">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex-grow">
              <SearchInput value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="flex-none mt-2 sm:mt-0">
              <AccordionTrigger className="p-0">
                <span className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium border rounded-md hover:bg-accent hover:text-accent-foreground">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  {isMobile ? 'Filtres' : 'Filtres avancés'}
                </span>
              </AccordionTrigger>
            </div>
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
              disableSourceFilter={disableSourceFilter}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
