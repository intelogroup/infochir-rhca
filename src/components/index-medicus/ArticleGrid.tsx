
import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import React, { FC, useState, useCallback, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Pagination } from "./components/Pagination";
import { ViewToggle } from "./ViewToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArticleSource } from "./types";

interface ArticleGridProps {
  viewMode?: "grid" | "table" | "list";
  source?: ArticleSource; // Added source prop
}

const ArticleGrid: FC<ArticleGridProps> = ({ 
  viewMode: initialViewMode = "table",
  source 
}) => {
  const isMobile = useIsMobile();
  // Always default to table view for better article title visibility
  const [viewMode, setViewMode] = useState<"grid" | "table" | "list">("table");
  const [currentPage, setCurrentPage] = useState(0);
  const mountedRef = useRef(false);
  const { data, isLoading, error, refetch } = useArticlesQuery(currentPage, source);
  
  // Mark component as mounted
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);
  
  // Add retry mechanism for failed initial load
  useEffect(() => {
    if (error && mountedRef.current) {
      // Retry loading data after a short delay
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          refetch();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, refetch]);
  
  console.log('ArticleGrid rendering with viewMode:', viewMode, 'isMobile:', isMobile, 'source:', source);
  
  const articles = data?.articles || [];
  const totalPages = data?.totalPages || 0;

  const {
    searchTerm,
    setSearchTerm,
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
    filteredArticles,
    categories,
    sources,
    availableTags,
    availableAuthors,
    articleStats
  } = useArticlesState(articles);

  const handleSearch = useCallback(async () => {
    try {
      console.time('Search Operation');
      console.log("Searching with filters:", { 
        searchTerm, 
        selectedCategory, 
        selectedSource, 
        selectedTags,
        selectedAuthors,
        titleFilter,
        date 
      });
      
      await setCurrentPage(0);
      console.timeEnd('Search Operation');
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [
    searchTerm, 
    selectedCategory, 
    selectedSource, 
    selectedTags,
    selectedAuthors,
    titleFilter,
    date,
    setCurrentPage
  ]);

  const handleTagClick = useCallback((tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  }, [selectedTags, setSelectedTags]);

  const handleRetry = () => {
    refetch();
  };
  
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => {
      if (prev === "grid") return "table";
      if (prev === "table") return "list";
      return "grid";
    });
  }, []);

  // We'll maintain table view regardless of device for better title visibility
  useEffect(() => {
    setViewMode("table");
  }, []);

  if (error) {
    return <ErrorDisplay error={error as Error} onRetry={handleRetry} />;
  }

  // Using a simplified loading state to prevent flashing
  if (isLoading && articles.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-8">
        <LoadingSpinner size="lg" variant="primary" text="Chargement des articles..." />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSource={source ? undefined : selectedSource} // Don't allow source filter if source is specified via props
        setSelectedSource={setSelectedSource}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedAuthors={selectedAuthors}
        setSelectedAuthors={setSelectedAuthors}
        titleFilter={titleFilter}
        setTitleFilter={setTitleFilter}
        date={date}
        setDate={setDate}
        onSearch={handleSearch}
        categories={categories}
        sources={sources}
        availableTags={availableTags}
        availableAuthors={availableAuthors}
        articleStats={articleStats}
        disableSourceFilter={!!source} // Disable source filter if source is specified via props
      />
      
      <div className="flex justify-end">
        <ViewToggle 
          viewMode={viewMode} 
          toggleViewMode={toggleViewMode} 
          isMobile={isMobile} 
        />
      </div>
      
      {viewMode === "grid" ? (
        <VirtualizedArticleList
          articles={filteredArticles}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      ) : viewMode === "list" ? (
        <ArticleContent
          viewMode="list"
          articles={filteredArticles}
          isLoading={isLoading}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      ) : (
        <ArticleContent
          viewMode="table"
          articles={filteredArticles}
          isLoading={isLoading}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

ArticleGrid.displayName = 'ArticleGrid';

export { ArticleGrid };
