
import React from "react";
import { ArticleGrid } from "./ArticleGrid";
import { ArticleTable } from "./ArticleTable";
import { ArticleCompactList } from "./ArticleCompactList";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Pagination } from "./components/Pagination";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Article } from "./types";

interface ArticleContentProps {
  viewMode?: "grid" | "table" | "list" | "virtual";
  articles: Article[];
  isLoading: boolean;
  error?: Error | null;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => Promise<void> | void;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  viewMode = "table",
  articles,
  isLoading,
  error,
  onTagClick,
  selectedTags,
  currentPage = 0,
  totalPages = 0,
  onPageChange,
  onRefresh
}) => {
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-8">
        <LoadingSpinner size="lg" variant="primary" text="Chargement des articles..." />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => onRefresh?.()} />;
  }

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
        return <ArticleCompactList articles={articles} onTagClick={onTagClick} selectedTags={selectedTags} />;
      case 'table':
        return isMobile ? <ArticleCompactList articles={articles} onTagClick={onTagClick} selectedTags={selectedTags} /> : <ArticleTable articles={articles} />;
      case 'list':
        return <ArticleCompactList articles={articles} onTagClick={onTagClick} selectedTags={selectedTags} />;
      case 'virtual':
        return <VirtualizedArticleList articles={articles} onTagClick={onTagClick} selectedTags={selectedTags} />;
      default:
        return <ArticleTable articles={articles} />;
    }
  };

  return (
    <MobileOptimizedContainer 
      onRefresh={handleRefresh}
      className="space-y-6"
    >
      {renderContent()}
      
      {totalPages > 1 && onPageChange && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </MobileOptimizedContainer>
  );
};
