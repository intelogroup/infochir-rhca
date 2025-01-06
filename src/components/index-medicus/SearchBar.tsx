import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSearch: () => void;
  categories: string[];
  sources: string[];
  availableTags: string[];
  articleStats: {
    total: number;
    filtered: number;
    sources: Record<string, number>;
    categories: Record<string, number>;
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
  date,
  setDate,
  onSearch,
  categories,
  sources,
  availableTags,
  articleStats
}: SearchBarProps) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSource("");
    setSelectedTags([]);
    setDate(undefined);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedSource || selectedTags.length > 0 || date;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="search-filters">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher par titre, auteur, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <AccordionTrigger className="flex-none">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres avancés
              </Button>
            </AccordionTrigger>
          </div>

          <AccordionContent>
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

                <DatePickerWithRange date={date} setDate={setDate} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Mots-clés</p>
                <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};