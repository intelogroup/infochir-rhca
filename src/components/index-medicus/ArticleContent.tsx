
import React from "react";
import { Article } from "./types";
import { ArticleTable } from "./ArticleTable";
import { UnifiedArticleList } from "@/components/shared/UnifiedArticleList";
import { ArticleCompactList } from "./ArticleCompactList";

interface ArticleContentProps {
  articles: Article[];
  viewMode: "grid" | "table" | "list";
  isLoading?: boolean;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  articles,
  viewMode,
  isLoading = false,
  onTagClick,
  selectedTags = [],
}) => {
  return (
    <div className="w-full">
      {viewMode === "table" && (
        <ArticleTable 
          articles={articles}
          onTagClick={onTagClick}
          selectedTags={selectedTags}
        />
      )}
      
      {viewMode === "grid" && (
        <UnifiedArticleList
          articles={articles}
          variant="index-medicus"
          viewMode="grid"
          onTagClick={onTagClick}
          selectedTags={selectedTags}
          isLoading={isLoading}
        />
      )}

      {viewMode === "list" && (
        <ArticleCompactList
          articles={articles}
          onTagClick={onTagClick}
          selectedTags={selectedTags}
        />
      )}
    </div>
  );
};
