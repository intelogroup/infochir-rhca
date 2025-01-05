import { CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaArticle } from "../types";

interface ArticleHeaderProps {
  article: RhcaArticle;
}

export const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  return (
    <CardHeader className="p-6">
      <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
        <div className="w-full md:flex-1">
          <CardTitle 
            id={`article-title-${article.id}`}
            className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors"
          >
            {article.title}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {article.authors.join(", ")}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            <span>Page {article.pageNumber}</span>
            <span>{format(new Date(article.date), 'dd MMMM yyyy', { locale: fr })}</span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};