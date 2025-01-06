import { RhcaCard } from "./RhcaCard";
import { RhcaTable } from "./RhcaTable";
import type { RhcaArticle } from "./types";

interface RhcaArticleListProps {
  articles: RhcaArticle[];
  viewMode: "grid" | "table";
}

export const RhcaArticleList = ({ articles = [], viewMode }: RhcaArticleListProps) => {
  if (!articles?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun article trouvé
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {articles.map((article) => (
            <RhcaCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <RhcaTable articles={articles} />
      )}
    </div>
  );
};