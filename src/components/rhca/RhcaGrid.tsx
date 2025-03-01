
import * as React from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import { SORT_OPTIONS } from "@/types/sortOptions";
import type { SortOption } from "@/types/sortOptions";
import { RhcaArticleList } from "./RhcaArticleList";
import { motion } from "framer-motion";
import { DateRange } from "react-day-picker";
import { useRHCAArticles } from "./hooks/useRHCAArticles";

export const RhcaGrid: React.FC = () => {
  // Group all state hooks at the top
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("latest");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  
  // Fetch RHCA articles from Supabase
  const { data: articles = [], isLoading, error } = useRHCAArticles();

  // Memoize handler functions
  const handleSortChange = React.useCallback((value: SortOption) => {
    setSortBy(value);
  }, []);

  // Memoize filtered articles computation
  const filteredArticles = React.useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authors.some(author => 
          typeof author === 'string' && author.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDateRange = !dateRange?.from && !dateRange?.to ? true :
        new Date(article.date) >= (dateRange?.from || new Date(0)) &&
        new Date(article.date) <= (dateRange?.to || new Date());

      return matchesSearch && matchesDateRange;
    });
  }, [articles, searchTerm, dateRange]);

  // Memoize sorted articles computation
  const sortedArticles = React.useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filteredArticles, sortBy]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-gray-500">Chargement des articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">Une erreur est survenue lors du chargement des articles.</p>
        <p className="text-red-500 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <motion.div 
        className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchAndSort
            searchTerm={searchTerm}
            sortBy={sortBy}
            onSearch={setSearchTerm}
            onSort={handleSortChange}
            sortOptions={SORT_OPTIONS}
            className="flex-1 min-w-0"
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as "grid" | "table")}
            className="self-end sm:self-auto bg-gray-50/80 p-1.5 rounded-lg border border-gray-200"
          >
            <ToggleGroupItem 
              value="grid" 
              size="sm"
              className="data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm px-3 py-2"
              aria-label="Vue grille"
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="table" 
              size="sm"
              className="data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm px-3 py-2"
              aria-label="Vue liste"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </motion.div>

      <div className="px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <RhcaArticleList
            articles={sortedArticles}
            viewMode={viewMode}
          />
        </motion.div>
      </div>
    </div>
  );
};
