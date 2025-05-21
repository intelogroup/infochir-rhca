
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "./DateRangeSelector";
import { TagSelector } from "./TagSelector";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, X } from "lucide-react";

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
  const clearTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const clearAuthor = (author: string) => {
    setSelectedAuthors(selectedAuthors.filter(a => a !== author));
  };

  return (
    <div className="pt-4 pb-2 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title filter */}
        <div className="space-y-2">
          <label htmlFor="title-filter" className="text-sm font-medium">
            Titre
          </label>
          <Input
            id="title-filter"
            value={titleFilter}
            onChange={e => setTitleFilter(e.target.value)}
            placeholder="Filtrer par titre..."
            className="w-full"
          />
        </div>

        {/* Category filter */}
        <div className="space-y-2">
          <label htmlFor="category-filter" className="text-sm font-medium">
            Catégorie
          </label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category} ({articleStats.categories[category] || 0})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Source filter - Only show if not disabled */}
        {!disableSourceFilter && (
          <div className="space-y-2">
            <label htmlFor="source-filter" className="text-sm font-medium">
              Source
            </label>
            <Select
              value={selectedSource}
              onValueChange={setSelectedSource}
            >
              <SelectTrigger id="source-filter">
                <SelectValue placeholder="Toutes les sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Toutes les sources</SelectItem>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source} ({articleStats.sources[source] || 0})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

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
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <TagSelector
            availableTags={availableTags}
            selectedTags={selectedTags}
            onSelectTag={tag => setSelectedTags([...selectedTags, tag])}
          />
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <button
                  onClick={() => clearTag(tag)}
                  className="ml-1 rounded-full hover:bg-gray-300/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Authors filter */}
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Auteurs</label>
          <Select
            value=""
            onValueChange={author => {
              if (!selectedAuthors.includes(author)) {
                setSelectedAuthors([...selectedAuthors, author]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner des auteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableAuthors.map(author => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {selectedAuthors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedAuthors.map(author => (
              <Badge key={author} variant="secondary" className="px-2 py-1">
                {author}
                <button
                  onClick={() => clearAuthor(author)}
                  className="ml-1 rounded-full hover:bg-gray-300/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

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
