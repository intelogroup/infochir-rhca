
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookOpen, FileText } from "lucide-react";
import { CardActions } from "./CardActions";
import type { RhcaArticle } from "../types";

interface CardContentProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardContent: React.FC<CardContentProps> = ({ article, pdfUrl }) => {
  // Calculate total pages from pageNumber
  const getTotalPages = (() => {
    try {
      if (!article.pageNumber) return "- Pages";
      
      // Convert pageNumber to string for processing
      const pageNumber = typeof article.pageNumber === 'string' 
        ? article.pageNumber.trim()
        : String(article.pageNumber);
      
      // Handle page range format (e.g., "1-28")
      if (pageNumber.includes('-')) {
        const [start, end] = pageNumber.split('-').map(num => parseInt(num.trim(), 10));
        if (!isNaN(end)) {
          return `${end} Pages`;
        }
      } 
      // Handle single page format (e.g., "34")
      else {
        const pageNum = parseInt(pageNumber, 10);
        if (!isNaN(pageNum)) {
          return `${pageNum} Pages`;
        }
      }
      
      return "- Pages";
    } catch (error) {
      console.error('Error calculating total pages:', error);
      return "- Pages";
    }
  })();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-1.5 gap-2">
        <div className="flex items-center bg-blue-50 px-1.5 py-0.5 rounded-md">
          <CalendarIcon className="mr-1 h-2.5 w-2.5 text-blue-600 flex-shrink-0" />
          <span className="font-medium text-xs text-blue-700 truncate">
            {article.publicationDate ? new Date(article.publicationDate).toLocaleDateString('fr-FR') : 'Date non disponible'}
          </span>
        </div>
        {article.volume && article.issue && (
          <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded-md">
            <BookOpen className="mr-1 h-2.5 w-2.5 text-green-600 flex-shrink-0" />
            <span className="font-medium text-xs text-green-700 truncate">
              Vol. {article.volume}, N° {article.issue}
            </span>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-xs leading-tight line-clamp-2 mb-1.5 text-gray-800 hover:text-primary transition-colors">
        {article.title}
      </h3>
      
      {article.abstract && (
        <p className="text-muted-foreground text-xs line-clamp-2 mb-2 overflow-hidden leading-relaxed">
          {article.abstract}
        </p>
      )}
      
      <div className="flex flex-wrap gap-1 mt-auto mb-2 overflow-hidden">
        {article.tags && article.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="outline" className="px-1.5 py-0 text-xs bg-gray-50 hover:bg-gray-100 transition-colors truncate max-w-[80px] border-gray-200 text-gray-600">
            {tag}
          </Badge>
        ))}
        {article.tags && article.tags.length > 3 && (
          <Badge variant="outline" className="px-1.5 py-0 text-xs bg-gray-50 hover:bg-gray-100 transition-colors border-gray-200 text-gray-600">
            +{article.tags.length - 3}
          </Badge>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-auto pt-1.5 border-t border-gray-100">
        <div className="flex items-center bg-amber-50 px-1 py-0.5 rounded border border-amber-200 h-5">
          <FileText className="mr-0.5 h-2 w-2 text-amber-600 flex-shrink-0" />
          <span className="font-medium text-[10px] text-amber-700">
            {getTotalPages}
          </span>
        </div>
        <CardActions article={article} pdfUrl={pdfUrl} />
      </div>
    </div>
  );
};
