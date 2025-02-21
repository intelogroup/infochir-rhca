
import * as React from "react";
import { Card } from "@/components/ui/card";
import type { RhcaArticle } from "./types";
import { ArticleHeader } from "./article/ArticleHeader";
import { ArticleContent } from "./article/ArticleContent";
import { ArticleActions } from "./article/ArticleActions";
import { motion } from "framer-motion";
import { ArticleModal } from "./article/ArticleModal";

interface RhcaCardProps {
  article: RhcaArticle;
  onCardClick?: () => void;
  className?: string;
}

export const RhcaCard: React.FC<RhcaCardProps> = ({ article, onCardClick, className }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full"
      >
        <Card 
          className="group hover:shadow-md transition-all duration-300 cursor-pointer h-full transform hover:-translate-y-1 bg-white border border-gray-200"
          onClick={handleClick}
        >
          <div className="flex gap-4 p-4">
            <div className="w-20 flex-shrink-0">
              {article.imageUrl ? (
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-100">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] bg-emerald-50/50 rounded-lg border border-emerald-100/50 flex items-center justify-center">
                  <span className="text-emerald-600/30 text-lg font-semibold">PDF</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <ArticleContent article={article} />
                <div className="hidden sm:block">
                  <ArticleActions 
                    id={article.id}
                    volume={article.volume}
                    date={article.date}
                    onCardClick={onCardClick}
                  />
                </div>
              </div>
              <div className="mt-3 sm:hidden">
                <ArticleActions 
                  id={article.id}
                  volume={article.volume}
                  date={article.date}
                  onCardClick={onCardClick}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <ArticleModal
        article={article}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
