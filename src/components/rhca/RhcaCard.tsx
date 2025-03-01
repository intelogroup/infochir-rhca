
import * as React from "react";
import { Card } from "@/components/ui/card";
import type { RhcaArticle } from "./types";
import { ArticleContent } from "./article/ArticleContent";
import { ArticleActions } from "./article/ArticleActions";
import { motion } from "framer-motion";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { useState, useEffect } from "react";
import { checkFileExistsInBucket, getFilePublicUrl } from "@/lib/pdf-utils";

interface RhcaCardProps {
  article: RhcaArticle;
  onCardClick?: () => void;
  className?: string;
}

export const RhcaCard: React.FC<RhcaCardProps> = ({ article, onCardClick, className }) => {
  const [coverExists, setCoverExists] = useState<boolean | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(article.imageUrl);
  
  useEffect(() => {
    const verifyCoverExists = async () => {
      if (!article.coverImageFileName) {
        setCoverExists(false);
        return;
      }
      
      const exists = await checkFileExistsInBucket('rhca_covers', article.coverImageFileName);
      setCoverExists(exists);
      
      if (exists) {
        const url = getFilePublicUrl('rhca_covers', article.coverImageFileName);
        if (url) setCoverUrl(url);
      }
    };
    
    verifyCoverExists();
  }, [article.coverImageFileName]);

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
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
            {coverExists && coverUrl ? (
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-100">
                <ImageOptimizer 
                  src={coverUrl} 
                  alt={article.title}
                  className="object-cover w-full h-full"
                  width={80}
                  height={120}
                  fallbackText="RHCA"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] bg-emerald-50/50 rounded-lg border border-emerald-100/50 flex items-center justify-center">
                <span className="text-emerald-600/30 text-lg font-semibold">RHCA</span>
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
                  pdfFileName={article.pdfFileName}
                />
              </div>
            </div>
            <div className="mt-3 sm:hidden">
              <ArticleActions 
                id={article.id}
                volume={article.volume}
                date={article.date}
                pdfFileName={article.pdfFileName}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
