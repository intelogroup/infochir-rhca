
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "./DateRangeSelector";
import { TagSelector } from "./TagSelector";
import { RefreshCw } from "lucide-react";
import { CategoryFilter } from "./filters/CategoryFilter";
import { SourceFilter } from "./filters/SourceFilter";
import { AuthorFilter } from "./filters/AuthorFilter";
import { TitleFilter } from "./filters/TitleFilter";

interface FilterAccordionProps {
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
  hasActiveFilters: boolean;
  clearFilters: () => void;
  disableSourceFilter?: boolean;
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
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
  hasActiveFilters,
  clearFilters,
  disableSourceFilter = false
}) => {
  return (
    <div className="pt-4 pb-2 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title filter */}
        <TitleFilter 
          titleFilter={titleFilter}
          setTitleFilter={setTitleFilter}
        />

        {/* Category filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          categoryStats={articleStats.categories}
        />

        {/* Source filter */}
        <SourceFilter
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          sources={sources}
          sourceStats={articleStats.sources}
          disabled={disableSourceFilter}
        />

        {/* Date range filter */}
        <div className="space-y-2">
          <label htmlFor="date-filter" className="text-sm font-medium">
            Date de publication
          </label>
          <DateRangeSelector
            date={date}
            setDate={setDate}
          />
        </div>
      </div>

      {/* Tags filter */}
      <div className="space-y-3">
        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onSelectTag={tag => setSelectedTags([...selectedTags, tag])}
          onRemoveTag={tag => setSelectedTags(selectedTags.filter(t => t !== tag))}
        />
      </div>

      {/* Authors filter */}
      <AuthorFilter
        selectedAuthors={selectedAuthors}
        setSelectedAuthors={setSelectedAuthors}
        availableAuthors={availableAuthors}
      />

      {/* Filter actions */}
      <div className="flex justify-end pt-2">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs sm:text-sm gap-1 sm:gap-2"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    </div>
  );
};
