import type { RhcaArticle } from "../types";

interface ArticleContentProps {
  article: RhcaArticle;
}

export const ArticleContent = ({ article }: ArticleContentProps) => {
  return (
    <div className="py-3 sm:py-4">
      <p className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-3">
        {article.abstract}
      </p>
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
        <span>Volume {article.volume}</span>
        <span className="text-gray-300">•</span>
        <span>Page {article.pageNumber}</span>
      </div>
    </div>
  );
};