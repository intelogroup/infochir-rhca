
import React from "react";
import { ArticleTableRow } from "./article/ArticleTableRow";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Article } from "./types";

interface ArticleTableProps {
  articles: Article[];
  isLoading?: boolean;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  isLoading = false,
  onTagClick,
  selectedTags = []
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" variant="primary" />
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun article trouvé
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">
              Titre
            </th>
            <th className="text-left py-2 px-3 text-sm font-semibold text-foreground hidden md:table-cell">
              Auteur(s)
            </th>
            <th className="text-left py-2 px-3 text-sm font-semibold text-foreground hidden lg:table-cell">
              Source
            </th>
            <th className="text-left py-2 px-3 text-sm font-semibold text-foreground hidden xl:table-cell">
              Date
            </th>
            <th className="text-right py-2 px-3 text-sm font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <ArticleTableRow
              key={article.id}
              article={article}
              onTagClick={onTagClick}
              selectedTags={selectedTags}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
