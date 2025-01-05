import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaArticle } from "../types";

interface ArticleHeaderProps {
  article: RhcaArticle;
}

export const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  return (
    <div className="mb-4">
      <h3 
        id={`article-title-${article.id}`}
        className="text-xl font-bold text-primary mb-2 line-clamp-2 group-hover:text-primary-light transition-colors"
      >
        {article.title}
      </h3>
      <p className="text-sm text-gray-600 mb-1 line-clamp-1">
        {article.authors.join(", ")}
      </p>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span>Page {article.pageNumber}</span>
        <span>{format(new Date(article.date), 'dd MMMM yyyy', { locale: fr })}</span>
      </div>
    </div>
  );
};