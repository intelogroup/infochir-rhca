import type { RhcaArticle } from "../types";

interface ArticleContentProps {
  article: RhcaArticle;
}

export const ArticleContent = ({ article }: ArticleContentProps) => {
  return (
    <div className="py-3">
      <p className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 line-clamp-2">
        {article.abstract}
      </p>
    </div>
  );
};