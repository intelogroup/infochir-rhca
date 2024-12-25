import { SearchBar } from "./index-medicus/SearchBar";
import { ArticlesTable } from "./index-medicus/ArticlesTable";
import { categories, sources } from "./index-medicus/constants";
import { useIndexMedicusSearch } from "@/hooks/useIndexMedicusSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArticlesGrid } from "./index-medicus/ArticlesGrid";

export const IndexMedicusGrid = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    date,
    setDate,
    filteredArticles,
    isLoading,
    error,
    handleSearch,
  } = useIndexMedicusSearch();

  if (!Array.isArray(categories) || !Array.isArray(sources)) {
    console.error("Categories and sources must be arrays");
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur de configuration est survenue. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-xs rounded-xl p-4 border border-gray-100 mb-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={`skeleton-search-${i}`} className="h-10" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={`skeleton-article-${i}`} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {typeof error === 'string' 
            ? error 
            : 'Une erreur est survenue lors du chargement des articles. Veuillez réessayer.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        date={date}
        setDate={setDate}
        onSearch={handleSearch}
        categories={categories}
        sources={sources}
      />

      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          onClick={() => setViewMode('grid')}
          size="sm"
        >
          Grille
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          onClick={() => setViewMode('table')}
          size="sm"
        >
          Tableau
        </Button>
      </div>

      {viewMode === 'table' ? (
        <ArticlesTable articles={filteredArticles || []} />
      ) : (
        <ArticlesGrid articles={filteredArticles || []} isLoading={isLoading} />
      )}
    </div>
  );
};