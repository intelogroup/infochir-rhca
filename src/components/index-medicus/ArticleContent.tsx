
import { UnifiedArticleList } from "@/components/shared/UnifiedArticleList";
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
