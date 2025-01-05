import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaArticle } from "../types";

interface ArticleHeaderProps {
  article: RhcaArticle;
}

export const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  return (
    <div className="space-y-2 flex-1">
      <h3 
        id={`article-title-${article.id}`}
        className="text-[clamp(1rem,0.95rem+0.25vw,1.25rem)] font-semibold text-gray-900 line-clamp-2"
      >
        {article.title}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Calendar className="h-4 w-4 flex-shrink-0" />
        {article.publicationDate && (
          <span className="truncate">
            {format(new Date(article.publicationDate), 'dd MMMM yyyy', { locale: fr })}
          </span>
        )}
        {article.authors?.length > 0 && (
          <>
            <span className="text-gray-300">•</span>
            <span className="truncate">{article.authors.join(', ')}</span>
          </>
        )}
      </div>
    </div>
  );
};