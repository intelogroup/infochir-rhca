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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import type { SortOption } from "@/types/sortOptions";

interface SearchAndSortProps {
  searchTerm: string;
  sortBy: string;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
  sortOptions: readonly { value: string; label: string; }[];
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
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
  selectedCategories = [],
  onCategoryChange,
  availableCategories = [],
  disabled = false,
}: SearchAndSortProps) => {
  const hasActiveFilters = Boolean(
    dateRange?.from || 
    dateRange?.to || 
    selectedCategories.length > 0
  );

  const clearFilters = () => {
    onDateRangeChange?.(undefined);
    onCategoryChange?.([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.div 
          className="relative flex-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Rechercher par titre, auteur, catégorie..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 h-12 text-base border-gray-200 hover:border-primary/50 focus:border-primary transition-colors shadow-sm"
            disabled={disabled}
          />
        </motion.div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={sortBy}
                  onValueChange={onSort}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full sm:w-[200px] h-12">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <AnimatePresence>
                      {sortOptions.map((option) => (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SelectItem value={option.value}>
                            {option.label}
                          </SelectItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Trier les résultats</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters" className="border-none">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Filter className="h-4 w-4" />
                <span>Filtres avancés</span>
                {hasActiveFilters && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-primary/10 text-primary animate-fade-up"
                  >
                    {selectedCategories.length + (dateRange ? 1 : 0)}
                  </Badge>
                )}
              </motion.div>
            </AccordionTrigger>
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2 text-gray-500 hover:text-gray-900"
                  >
                    <X className="h-4 w-4" />
                    Effacer les filtres
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AccordionContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Période</label>
                      <DatePickerWithRange 
                        date={dateRange} 
                        setDate={onDateRangeChange}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtrer par date de publication</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Catégories</label>
                      <Select
                        value={selectedCategories[0] || ""}
                        onValueChange={(value) => onCategoryChange?.([value])}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <AnimatePresence>
                            {availableCategories.map((category) => (
                              <motion.div
                                key={category}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <SelectItem value={category}>
                                  {category}
                                </SelectItem>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtrer par catégorie d'article</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};