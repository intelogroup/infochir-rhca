
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArticleMetadata } from './article/ArticleMetadata';
import { ArticleActions } from './article/ArticleActions';
import type { Article } from './types';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PdfStatusIndicator } from '@/components/shared/PdfStatusIndicator';
import { BookOpen, Bookmark } from "lucide-react";
import { toast } from "sonner";

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open the PDF if clicking the card itself, not the buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (!article.pdfUrl) {
      toast.error("PDF non disponible pour cet article");
      return;
    }
    
    // Open the PDF in a new tab
    window.open(article.pdfUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className={`group h-full flex flex-col transition-all duration-300 border hover:shadow-md hover:border-primary/20 overflow-hidden cursor-pointer
          ${isSelected ? 'ring-2 ring-primary border-primary shadow-lg' : ''}
          ${article.specialty ? 'border-l-4 border-l-secondary' : ''}
        `}
        onClick={handleCardClick}
      >
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex justify-between mb-3">
            <Badge variant="outline" className="text-xs bg-secondary/10 hover:bg-secondary/20 font-medium px-2.5 py-0.5 text-secondary">
              {article.source}
            </Badge>
            {article.specialty && (
              <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5 bg-secondary/20 text-secondary-dark">
                {article.specialty}
              </Badge>
            )}
          </div>
          
          <div className="flex items-start gap-2 mb-3">
            <div className="mt-1 flex-shrink-0">
              {article.pdfUrl ? (
                <PdfStatusIndicator 
                  status="available" 
                  size="sm"
                />
              ) : (
                <BookOpen className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-primary line-clamp-2 group-hover:text-primary-light transition-colors">
              {article.title}
            </h3>
          </div>
          
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
          
          <p className="text-sm text-gray-600 mt-4 mb-4 line-clamp-3 flex-grow leading-relaxed">
            {article.abstract}
          </p>
          
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <ArticleActions 
                title={article.title}
                pdfUrl={article.pdfUrl}
                onCitation={handleCitation}
                onShare={handleShare}
              />
              
              <button 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Bookmark"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
