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

  const filteredArticles = mockArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <SearchAndSort
          searchTerm={searchTerm}
          sortBy={sortBy}
          onSearch={setSearchTerm}
          onSort={handleSortChange}
          sortOptions={SORT_OPTIONS}
          className="flex-1"
        />
        
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => value && setViewMode(value as "grid" | "table")}
          className="self-end sm:self-auto bg-gray-50 p-1 rounded-md border border-gray-200"
        >
          <ToggleGroupItem 
            value="grid" 
            size="sm"
            className="data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm"
          >
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="table" 
            size="sm"
            className="data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm"
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