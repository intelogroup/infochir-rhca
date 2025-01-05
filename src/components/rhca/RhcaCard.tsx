import { Card } from "@/components/ui/card";
import type { RhcaArticle } from "./types";
import { ArticleHeader } from "./article/ArticleHeader";
import { ArticleContent } from "./article/ArticleContent";
import { ArticleActions } from "./article/ArticleActions";

interface RhcaCardProps {
  article: RhcaArticle;
  onCardClick?: () => void;
}

export const RhcaCard = ({ article, onCardClick }: RhcaCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white"
      onClick={onCardClick}
      role="article"
      aria-labelledby={`article-title-${article.id}`}
    >
      <ArticleHeader article={article} />
      <ArticleContent article={article} />
      <ArticleActions 
        id={article.id}
        pdfUrl={article.pdfUrl}
        onCardClick={onCardClick}
      />
    </Card>
  );
};