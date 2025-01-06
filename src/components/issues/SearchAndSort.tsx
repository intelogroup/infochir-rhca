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
import type { SortOption } from "@/types/sortOptions";

interface SearchAndSortProps {
  searchTerm: string;
  sortBy: string;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
  sortOptions: readonly { value: string; label: string; }[];
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  selectedAuthors?: string[];
  onAuthorChange?: (authors: string[]) => void;
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  availableAuthors?: string[];
  availableCategories?: string[];
  disabled?: boolean;
}

export const SearchAndSort = ({
  searchTerm,
  sortBy,
  onSearch,
  onSort,
  sortOptions,
  dateRange,
  onDateRangeChange,
  selectedAuthors = [],
  onAuthorChange,
  selectedCategories = [],
  onCategoryChange,
  availableAuthors = [],
  availableCategories = [],
  disabled = false,
}: SearchAndSortProps) => {
  const hasActiveFilters = Boolean(
    dateRange?.from || 
    dateRange?.to || 
    selectedAuthors.length > 0 || 
    selectedCategories.length > 0
  );

  const clearFilters = () => {
    onDateRangeChange?.(undefined);
    onAuthorChange?.([]);
    onCategoryChange?.([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher par titre, auteur, catégorie..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={onSort}
          disabled={disabled}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtres avancés</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedAuthors.length + selectedCategories.length + (dateRange ? 1 : 0)}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Effacer les filtres
              </Button>
            )}
          </div>

          <AccordionContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <DatePickerWithRange 
                  date={dateRange} 
                  setDate={onDateRangeChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégories</label>
                <Select
                  value={selectedCategories[0] || ""}
                  onValueChange={(value) => onCategoryChange?.([value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};