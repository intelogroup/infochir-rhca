import type { RhcaArticle } from "../types";

interface ArticleContentProps {
  article: RhcaArticle;
}

export const ArticleContent = ({ article }: ArticleContentProps) => {
  return (
    <div className="py-2 md:py-3">
      <p className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 line-clamp-2 md:line-clamp-3">
        {article.abstract}
      </p>
      <div className="flex items-center gap-2 mt-2 text-[clamp(0.75rem,0.7rem+0.1vw,0.875rem)] text-gray-500">
        <span>Volume {article.volume}</span>
        <span className="text-gray-300">•</span>
        <span>Page {article.pageNumber}</span>
      </div>
    </div>
  );
};