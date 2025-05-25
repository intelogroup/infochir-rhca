
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import type { Article } from "@/components/index-medicus/types";
import { ArticleTags } from "./article/ArticleTags";
import { ArticleCategories } from "./article/ArticleCategories";
import { ArticleMetadata } from "./article/ArticleMetadata";
import { ArticleActions } from "./article/ArticleActions";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { ArticleModal } from "./article/ArticleModal";
import { motion } from "framer-motion";

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onTagClick, selectedTags }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open the modal if clicking the card itself, not the buttons or tags
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('[data-tag]')) {
      return;
    }
    
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className="hover:shadow-lg transition-shadow overflow-hidden group rounded-xl cursor-pointer bg-white border-gray-100"
          onClick={handleCardClick}
        >
          <div className="flex flex-col md:flex-row">
            {article.imageUrl ? (
              <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
                <ImageOptimizer 
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={192}
                  height={192}
                />
              </div>
            ) : (
              <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                <User className="h-12 w-12 text-primary/20" />
              </div>
            )}
            <div className="flex-1">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <ArticleMetadata 
                      authors={article.authors}
                      date={article.publicationDate}
                      views={article.views}
                      citations={article.citations}
                      downloads={article.downloads}
                      shares={article.shares}
                      volume={article.volume}
                      issue={article.issue}
                      pageNumber={article.pageNumber}
                      specialty={article.specialty}
                    />
                  </div>
                  <ArticleCategories 
                    source={article.source}
                    category={article.category}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {article.abstract}
                </p>
                <div className="mb-4">
                  <ArticleTags 
                    tags={article.tags}
                    onTagClick={onTagClick}
                    selectedTags={selectedTags}
                  />
                </div>
                <ArticleActions 
                  article={article}
                  pdfUrl={article.pdfUrl}
                />
              </CardContent>
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
