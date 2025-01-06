import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DateRangeSelector } from "./DateRangeSelector";
import { TagSelector } from "./TagSelector";
import { DateRange } from "react-day-picker";

interface FilterAccordionProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  categories: string[];
  sources: string[];
  availableTags: string[];
  articleStats: {
    total: number;
    filtered: number;
    sources: Record<string, number>;
    categories: Record<string, number>;
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
  date,
  setDate,
  categories,
  sources,
  availableTags,
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

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <TagSelector
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />

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