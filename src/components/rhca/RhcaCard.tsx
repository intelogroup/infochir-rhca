import { Card } from "@/components/ui/card";
import type { RhcaArticle } from "./types";
import { ArticleHeader } from "./article/ArticleHeader";
import { ArticleContent } from "./article/ArticleContent";
import { ArticleActions } from "./article/ArticleActions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { ArticleModal } from "./article/ArticleModal";

interface RhcaCardProps {
  article: RhcaArticle;
  onCardClick?: () => void;
  className?: string;
}

export const RhcaCard = ({ article, onCardClick, className }: RhcaCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card 
        className={`group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white h-full border-gray-100 overflow-hidden ${className ?? ''}`}
        onClick={handleClick}
        role="article"
        aria-labelledby={`article-title-${article.id}`}
      >
        <div className="flex flex-col md:flex-row gap-4 p-4 sm:p-6 h-full">
          <div className="w-full md:w-36 flex-shrink-0">
            <AspectRatio ratio={3/4} className="overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
              {article.imageUrl ? (
                <img 
                  src={article.imageUrl} 
                  alt={`Image pour ${article.title}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xl font-semibold">PDF</span>
                </div>
              )}
            </AspectRatio>
          </div>
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <ArticleHeader article={article} />
            <ArticleContent article={article} />
            <div className="mt-auto pt-4">
              <ArticleActions 
                id={article.id}
                pdfUrl={article.pdfUrl}
                onCardClick={onCardClick}
              />
            </div>
          </div>
        </div>
      </Card>

      <ArticleModal
        article={article}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};