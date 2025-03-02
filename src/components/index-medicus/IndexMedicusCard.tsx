
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArticleMetadata } from './article/ArticleMetadata';
import { ArticleActions } from './article/ArticleActions';
import { ArticleTags } from './article/ArticleTags';
import type { Article } from './types';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface IndexMedicusCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  isSelected?: boolean;
}

export const IndexMedicusCard: React.FC<IndexMedicusCardProps> = ({ 
  article, 
  onTagClick,
  isSelected = false,
}) => {
  const handleCitation = (format: "APA" | "MLA" | "Chicago" | "Harvard") => {
    // Generate citation based on format
    const citation = `${article.authors.join(', ')} (${new Date(article.date).getFullYear()}). ${article.title}.`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(citation).then(() => {
      console.log(`Citation copied in ${format} format`);
    });
  };

  const handleShare = () => {
    // Share article
    console.log('Share article', article.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className={`group h-full flex flex-col transition-all duration-200 border hover:shadow-md overflow-hidden ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}>
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex justify-between mb-2">
            <Badge variant="outline" className="text-xs bg-secondary/10 hover:bg-secondary/20">
              {article.source}
            </Badge>
            {article.specialty && (
              <Badge variant="secondary" className="text-xs">
                {article.specialty}
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          
          <ArticleMetadata 
            authors={article.authors}
            date={article.date}
            views={article.views}
            citations={article.citations}
            downloads={article.downloads}
            specialty={article.specialty}
            volume={article.volume}
            issue={article.issue}
            pageNumber={article.pageNumber}
          />
          
          <p className="text-sm text-gray-600 mt-4 mb-4 line-clamp-3 flex-grow">
            {article.abstract}
          </p>
          
          <div className="mt-auto">
            <ArticleTags 
              tags={article.tags} 
              onTagClick={onTagClick}
              selectedTags={[]}
            />
            
            <div className="mt-4 flex justify-between items-center">
              <ArticleActions 
                title={article.title}
                pdfUrl={article.pdfUrl}
                onCitation={handleCitation}
                onShare={handleShare}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
