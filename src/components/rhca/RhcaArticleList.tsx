import { RhcaCard } from "./RhcaCard";
import { RhcaTable } from "./RhcaTable";
import type { RhcaArticle } from "./types";

interface RhcaArticleListProps {
  articles: RhcaArticle[];
  viewMode: "grid" | "table";
}

export const RhcaArticleList = ({ articles = [], viewMode }: RhcaArticleListProps) => {
  console.log('RhcaArticleList - articles:', articles);
  
  if (!articles?.length) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <p className="text-gray-500 text-center">
          Aucun article trouvé
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((article) => (
            <div key={article.id} className="w-full animate-fade-up">
              <RhcaCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <RhcaTable articles={articles} />
        </div>
      )}
    </div>
  );
};