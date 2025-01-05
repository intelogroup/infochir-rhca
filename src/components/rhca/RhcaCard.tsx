import { Card } from "@/components/ui/card";
import type { RhcaArticle } from "./types";
import { ArticleHeader } from "./article/ArticleHeader";
import { ArticleContent } from "./article/ArticleContent";
import { ArticleActions } from "./article/ArticleActions";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface RhcaCardProps {
  article: RhcaArticle;
  onCardClick?: () => void;
}

export const RhcaCard = ({ article, onCardClick }: RhcaCardProps) => {
  return (
    <Card 
      className="group hover:shadow-lg transition-shadow h-full bg-white"
      onClick={onCardClick}
      role="article"
      aria-labelledby={`article-title-${article.id}`}
    >
      <div className="flex gap-4 p-4 h-full">
        <div className="w-32 flex-shrink-0">
          <AspectRatio ratio={3/4} className="overflow-hidden rounded-lg">
            {article.imageUrl ? (
              <img 
                src={article.imageUrl} 
                alt={`Image pour ${article.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                <span className="text-secondary/20 text-xl font-bold">PDF</span>
              </div>
            )}
          </AspectRatio>
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <ArticleHeader article={article} />
          <ArticleContent article={article} />
          <ArticleActions 
            id={article.id}
            pdfUrl={article.pdfUrl}
            onCardClick={onCardClick}
          />
        </div>
      </div>
    </Card>
  );
};