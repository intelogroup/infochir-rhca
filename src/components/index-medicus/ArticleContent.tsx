
import React from 'react';
import { UnifiedArticleList } from "@/components/shared/UnifiedArticleList";
import type { Article } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleContentProps {
  viewMode: "grid" | "table";
  articles: Article[];
  isLoading: boolean;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  viewMode,
  articles,
  isLoading,
  onTagClick,
  selectedTags = [],
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <UnifiedArticleList
      viewMode={viewMode}
      articles={articles}
      variant="index-medicus"
      onTagClick={onTagClick}
      selectedTags={selectedTags}
      isLoading={isLoading}
    />
  );
};
