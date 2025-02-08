
import { ArticleCard } from "@/components/index-medicus/ArticleCard";
import { ArticleTable } from "@/components/index-medicus/ArticleTable";
import { RhcaCard } from "@/components/rhca/RhcaCard";
import { RhcaTable } from "@/components/rhca/RhcaTable";
import type { Article } from "@/types/article";
import type { RhcaArticle } from "@/components/rhca/types";

type ViewMode = "grid" | "table";

interface UnifiedArticleListProps {
  viewMode: ViewMode;
  articles: (Article | RhcaArticle)[];
  variant: "index-medicus" | "rhca";
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
  isLoading?: boolean;
}

export const UnifiedArticleList = ({
  viewMode,
  articles,
  variant,
  onTagClick,
  selectedTags,
  isLoading = false
}: UnifiedArticleListProps) => {
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

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun article trouvé
      </div>
    );
  }

  if (variant === "index-medicus") {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article as Article}
              onTagClick={onTagClick}
              selectedTags={selectedTags}
            />
          ))}
        </div>
      );
    }
    return <ArticleTable articles={articles as Article[]} />;
  }

  // RHCA variant
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {articles.map((article) => (
          <RhcaCard key={article.id} article={article as RhcaArticle} />
        ))}
      </div>
    );
  }
  return <RhcaTable articles={articles as RhcaArticle[]} />;
};
