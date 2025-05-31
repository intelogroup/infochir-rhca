
import React from "react";
import { ArticleGrid } from "./ArticleGrid";
import { ArticleTable } from "./ArticleTable";
import { ArticleCompactList } from "./ArticleCompactList";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import { LoadingState } from "./components/LoadingState";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Pagination } from "./components/Pagination";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { useIsMobile } from "@/hooks/use-mobile";

export const ArticleContent: React.FC = () => {
  const {
    searchTerm,
    selectedSources,
    selectedTags,
    selectedCategories,
    selectedAuthors,
    dateRange,
    sortBy,
    sortOrder,
    viewMode,
    currentPage,
    setCurrentPage,
    ITEMS_PER_PAGE
  } = useArticlesState();

  const isMobile = useIsMobile();

  const {
    data: articlesData,
    isLoading,
    error,
    refetch
  } = useArticlesQuery({
    searchTerm,
    selectedSources,
    selectedTags,
    selectedCategories,
    selectedAuthors,
    dateRange,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => refetch()} />;
  }

  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const renderContent = () => {
    if (articles.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun article trouvé</p>
          <p className="text-gray-400 text-sm mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      );
    }

    switch (viewMode) {
      case 'grid':
        return <ArticleGrid articles={articles} />;
      case 'table':
        return isMobile ? <ArticleCompactList articles={articles} /> : <ArticleTable articles={articles} />;
      case 'list':
        return <ArticleCompactList articles={articles} />;
      case 'virtual':
        return <VirtualizedArticleList articles={articles} />;
      default:
        return <ArticleGrid articles={articles} />;
    }
  };

  return (
    <MobileOptimizedContainer 
      onRefresh={handleRefresh}
      className="space-y-6"
    >
      {renderContent()}
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </MobileOptimizedContainer>
  );
};
