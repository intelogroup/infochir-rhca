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
import { SourceFilter, SourceFilterType } from "./SourceFilter";

interface ArticleGridProps {
  viewMode?: "grid" | "table" | "list";
  source?: ArticleSource;
  sourceFilter?: SourceFilterType;
  onSourceFilterChange?: (source: SourceFilterType) => void;
}

const ArticleGrid: FC<ArticleGridProps> = ({ 
  viewMode: initialViewMode = "table",
  source,
  sourceFilter = 'all',
  onSourceFilterChange
}) => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"grid" | "table" | "list">("table");
  const [currentPage, setCurrentPage] = useState(0);
  const mountedRef = useRef(false);
  
  // Convert SourceFilterType to ArticleSource for the query
  const getQuerySource = (filter: SourceFilterType): ArticleSource | undefined => {
    if (filter === 'all') return undefined;
    if (filter === 'ADC') return 'ADC';
    if (filter === 'IGM') return 'IGM';
    if (filter === 'RHCA') return 'RHCA';
    if (filter === 'INDEX_ARTICLES') return 'INDEX';
    return undefined;
  };

  // Get category filter for INDEX_ARTICLES
  const getCategoryFilter = (filter: SourceFilterType): string | undefined => {
    if (filter === 'INDEX_ARTICLES') return 'article';
    return undefined;
  };

  const querySource = source || getQuerySource(sourceFilter);
  const categoryFilter = getCategoryFilter(sourceFilter);
  const { data, isLoading, error, refetch } = useArticlesQuery(currentPage, querySource, categoryFilter);
  
  // Mark component as mounted
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);
  
  // Add retry mechanism for failed initial load
  useEffect(() => {
    if (error && mountedRef.current) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          refetch();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, refetch]);
  
  console.log('ArticleGrid rendering with viewMode:', viewMode, 'isMobile:', isMobile, 'sourceFilter:', sourceFilter);
  
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

  // Filter articles for INDEX_ARTICLES (articles with category containing "Article")
  const finalFilteredArticles = filteredArticles;

  // Calculate article counts for the SourceFilter component
  const articleCounts = {
    total: articleStats.total,
    ADC: articleStats.sources['ADC'] || 0,
    IGM: articleStats.sources['IGM'] || 0,
    RHCA: articleStats.sources['RHCA'] || 0,
    INDEX_ARTICLES: articles.filter(article => 
      article.source === 'INDEX' && (
        article.category.toLowerCase().includes('article') || 
        article.category.toLowerCase().includes('index')
      )
    ).length
  };

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

  useEffect(() => {
    setViewMode("table");
  }, []);

  if (error) {
    return <ErrorDisplay error={error as Error} onRetry={handleRetry} />;
  }

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
        selectedSource={source ? undefined : selectedSource}
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
        disableSourceFilter={!!source || !!onSourceFilterChange}
      />

      {onSourceFilterChange && (
        <SourceFilter
          selectedSource={sourceFilter}
          onSourceChange={onSourceFilterChange}
          articleCounts={articleCounts}
        />
      )}
      
      <div className="flex justify-end">
        <ViewToggle 
          viewMode={viewMode} 
          toggleViewMode={toggleViewMode} 
          isMobile={isMobile} 
        />
      </div>
      
      {viewMode === "grid" ? (
        <VirtualizedArticleList
          articles={finalFilteredArticles}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      ) : viewMode === "list" ? (
        <ArticleContent
          viewMode="list"
          articles={finalFilteredArticles}
          isLoading={isLoading}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      ) : (
        <ArticleContent
          viewMode="table"
          articles={finalFilteredArticles}
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
