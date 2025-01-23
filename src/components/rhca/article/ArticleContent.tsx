import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaArticle } from "../types";

interface ArticleContentProps {
  article: RhcaArticle;
}

export const ArticleContent = ({ article }: ArticleContentProps) => {
  return (
    <div className="flex-1 min-w-0 space-y-2">
      <div>
        <h3 className="text-base font-semibold text-emerald-700 leading-tight tracking-tight truncate">
          {article.title}
        </h3>
        <div className="text-sm font-medium text-emerald-600/80 mt-1">
          Volume {article.volume}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {format(new Date(article.date), 'dd MMMM yyyy', { locale: fr })}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {article.abstract}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span className="bg-emerald-50 px-3 py-1 rounded-full font-medium text-emerald-600">
          {article.articles?.length || 0} articles
        </span>
        <span>{article.downloads} téléchargements</span>
        <span>{article.shares} partages</span>
      </div>
    </div>
  );
};