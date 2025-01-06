import { ArticleCard } from "./ArticleCard";
import { ArticleTable } from "./ArticleTable";
import type { Article } from "./types";

interface ArticleContentProps {
  viewMode: "grid" | "table";
  articles: Article[];
  isLoading: boolean;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleContent = ({
  viewMode,
  articles,
  isLoading,
  onTagClick,
  selectedTags,
}: ArticleContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary/20 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-primary/40 rounded-full animate-bounce [animation-delay:-.3s]" />
          <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce [animation-delay:-.5s]" />
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onTagClick={onTagClick}
            selectedTags={selectedTags}
          />
        ))}
      </div>
    );
  }

  return <ArticleTable articles={articles} />;
};