
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeSelector } from "@/components/index-medicus/search/DateRangeSelector";
import { DateRange } from "react-day-picker";
import type { SortOption } from "../constants/sortOptions";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Button } from "@/components/ui/button";

interface IssuesSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  dateRange?: DateRange;
  setDateRange?: (range: DateRange | undefined) => void;
  sortOptions: { label: string; value: SortOption }[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  availableCategories?: string[];
}

export const IssuesSearch = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  dateRange,
  setDateRange,
  sortOptions,
  selectedCategories = [],
  onCategoryChange,
  availableCategories = [],
}: IssuesSearchProps) => {
  const handleCategoryToggle = (category: string) => {
    if (!onCategoryChange) return;
    
    const isSelected = selectedCategories.includes(category);
    if (isSelected) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearCategories = () => {
    onCategoryChange?.([]);
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[1fr,auto,auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
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

          {setDateRange && (
            <DateRangeSelector
              date={dateRange}
              setDate={setDateRange}
            />
          )}
        </div>

        {availableCategories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Catégories</h3>
              {selectedCategories.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCategories}
                  className="h-8 px-2 text-sm"
                >
                  Effacer
                </Button>
              )}
            </div>
            <ScrollArea className="h-24 w-full rounded-md border">
              <div className="p-4 grid grid-cols-2 gap-2">
                {availableCategories.map((category) => (
                  <CheckboxWithLabel
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    label={category}
                  />
                ))}
              </div>
            </ScrollArea>
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
