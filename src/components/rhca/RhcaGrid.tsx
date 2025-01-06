import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";
import { SORT_OPTIONS } from "@/types/sortOptions";
import type { SortOption } from "@/types/sortOptions";
import { RhcaArticleList } from "./RhcaArticleList";
import { mockArticles } from "./data/mockArticles";

export const RhcaGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
  };

  // Add console.log to debug the filtered articles
  console.log('All mock articles:', mockArticles);

  const filteredArticles = mockArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('Filtered articles:', filteredArticles);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <SearchAndSort
          searchTerm={searchTerm}
          sortBy={sortBy}
          onSearch={setSearchTerm}
          onSort={handleSortChange}
          sortOptions={SORT_OPTIONS}
          className="flex-1 min-w-0"
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

      <RhcaArticleList
        articles={filteredArticles}
        viewMode={viewMode}
      />
    </div>
  );
};