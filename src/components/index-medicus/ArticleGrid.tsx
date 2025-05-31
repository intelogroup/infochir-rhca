
import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import React, { FC, useState, useCallback, useEffect, useRef, useMemo } from "react";
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
  sortBy?: "title" | "author";
}

const ArticleGrid: FC<ArticleGridProps> = ({ 
  viewMode: initialViewMode = "table",
  source,
  sourceFilter = 'all',
  onSourceFilterChange,
  sortBy = "title"
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
  
  // Fetch counts for all sources separately
  const { data: allData } = useArticlesQuery(0, undefined, undefined);
  const { data: adcData } = useArticlesQuery(0, 'ADC', undefined);
  const { data: igmData } = useArticlesQuery(0, 'IGM', undefined);
  const { data: rhcaData } = useArticlesQuery(0, 'RHCA', undefined);
  const { data: indexArticlesData } = useArticlesQuery(0, 'INDEX', 'article');
  
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
  
  console.log('ArticleGrid rendering with viewMode:', viewMode, 'isMobile:', isMobile, 'sourceFilter:', sourceFilter, 'sortBy:', sortBy);
  
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

  // Enhanced sorting with special Atlas (ADC) logic
  const sortedFilteredArticles = useMemo(() => {
    const sorted = [...filteredArticles];
    
    // Check if we're viewing Atlas (ADC) content
    const isAtlasView = sourceFilter === 'ADC' || querySource === 'ADC';
    
    if (isAtlasView) {
      if (sortBy === "title") {
        // For Atlas, sort by issue number when sorting by title
        return sorted.sort((a, b) => {
          const aIssue = a.issue ? parseInt(a.issue) : 0;
          const bIssue = b.issue ? parseInt(b.issue) : 0;
          return aIssue - bIssue;
        });
      } else if (sortBy === "author") {
        // For Atlas, sort alphabetically by author name
        return sorted.sort((a, b) => {
          const aFirstAuthor = a.authors && a.authors.length > 0 ? a.authors[0] : '';
          const bFirstAuthor = b.authors && b.authors.length > 0 ? b.authors[0] : '';
          return aFirstAuthor.localeCompare(bFirstAuthor, 'fr', { sensitivity: 'base' });
        });
      }
    } else {
      // Regular sorting for non-Atlas content
      if (sortBy === "title") {
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
      } else if (sortBy === "author") {
        return sorted.sort((a, b) => {
          const aFirstAuthor = a.authors && a.authors.length > 0 ? a.authors[0] : '';
          const bFirstAuthor = b.authors && b.authors.length > 0 ? b.authors[0] : '';
          return aFirstAuthor.localeCompare(bFirstAuthor, 'fr', { sensitivity: 'base' });
        });
      }
    }
    
    return sorted;
  }, [filteredArticles, sortBy, sourceFilter, querySource]);

  // Calculate article counts for the SourceFilter component using the separate queries
  const articleCounts = {
    total: allData?.articles?.length || 0,
    ADC: adcData?.articles?.length || 0,
    IGM: igmData?.articles?.length || 0,
    RHCA: rhcaData?.articles?.length || 0,
    INDEX_ARTICLES: indexArticlesData?.articles?.length || 0
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

  const handleRefresh = async () => {
    await refetch();
  };

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
      
      <ArticleContent
        viewMode={viewMode}
        articles={sortedFilteredArticles}
        isLoading={isLoading}
        error={error}
        onTagClick={handleTagClick}
        selectedTags={selectedTags}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

ArticleGrid.displayName = 'ArticleGrid';

export { ArticleGrid };
