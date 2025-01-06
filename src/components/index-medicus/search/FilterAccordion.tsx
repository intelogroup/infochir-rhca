import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DateRangeSelector } from "./DateRangeSelector";
import { TagSelector } from "./TagSelector";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";

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
}

export const FilterAccordion = ({
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
}: FilterAccordionProps) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAuthorToggle = (author: string) => {
    if (selectedAuthors.includes(author)) {
      setSelectedAuthors(selectedAuthors.filter(a => a !== author));
    } else {
      setSelectedAuthors([...selectedAuthors, author]);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label htmlFor="title-filter" className="text-sm font-medium text-gray-700">
            Titre
          </label>
          <Input
            id="title-filter"
            placeholder="Filtrer par titre..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>

        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  <span className="flex items-center justify-between w-full">
                    <span>{category}</span>
                    <Badge variant="secondary" className="ml-2">
                      {articleStats.categories[category]}
                    </Badge>
                  </span>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSource} value={selectedSource}>
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>
                <span className="flex items-center justify-between w-full">
                  <span>{source}</span>
                  <Badge variant="secondary" className="ml-2">
                    {articleStats.sources[source]}
                  </Badge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangeSelector date={date} setDate={setDate} />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Auteurs</h3>
          <ScrollArea className="h-[100px] w-full border rounded-md p-2">
            <div className="flex flex-wrap gap-2">
              {availableAuthors.map((author) => (
                <Badge
                  key={author}
                  variant={selectedAuthors.includes(author) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleAuthorToggle(author)}
                >
                  {author}
                  <span className="ml-1 text-xs">
                    ({articleStats.authors[author] || 0})
                  </span>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>

        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-600">
            {articleStats.filtered} résultat{articleStats.filtered !== 1 ? 's' : ''} sur {articleStats.total}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );
};