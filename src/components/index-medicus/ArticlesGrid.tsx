import { ArticleCard } from "./ArticleCard";
import { Loader2 } from "lucide-react";
import type { ArticleWithRelations } from "@/types/article";

interface ArticlesGridProps {
  articles: ArticleWithRelations[];
  isLoading: boolean;
}

export const ArticlesGrid = ({ articles, isLoading }: ArticlesGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun article trouvé
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};