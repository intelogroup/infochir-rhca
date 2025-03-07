
import React from 'react';
import { Calendar, User, Eye, FileText, BookOpen, BookMarked } from "lucide-react";

interface ArticleMetadataProps {
  authors: string[];
  date: string;
  views?: number;
  citations?: number;
  downloads?: number;
  shares?: number;
  specialty?: string;
  volume?: string;
  issue?: string;
  pageNumber?: string | number;
}

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({ 
  authors, 
  date, 
  views, 
  citations, 
  downloads,
  shares,
  specialty,
  volume,
  issue,
  pageNumber
}) => {
  // Convert pageNumber to string if it's a number
  const pageNumberString = pageNumber !== undefined 
    ? (typeof pageNumber === 'number' ? String(pageNumber) : pageNumber) 
    : undefined;
  
  return (
    <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-1">
      {authors && authors.length > 0 && (
        <div className="flex items-center gap-1">
          <User className="h-3 w-3 text-gray-400" />
          <span className="line-clamp-1">
            {authors.join(', ')}
          </span>
        </div>
      )}
      
      {date && (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )}
      
      {views !== undefined && (
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-gray-400" />
          <span>{views}</span>
        </div>
      )}
      
      {citations !== undefined && (
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3 text-gray-400" />
          <span>{citations}</span>
        </div>
      )}
      
      {volume && issue && (
        <div className="flex items-center gap-1">
          <BookOpen className="h-3 w-3 text-gray-400" />
          <span>Vol. {volume}, N° {issue}</span>
        </div>
      )}
      
      {pageNumberString && (
        <div className="flex items-center gap-1">
          <BookMarked className="h-3 w-3 text-gray-400" />
          <span>Page {pageNumberString}</span>
        </div>
      )}
      
      {downloads !== undefined && (
        <span className="text-gray-500">{downloads} téléchargements</span>
      )}
      
      {shares !== undefined && (
        <span className="text-gray-500">{shares} partages</span>
      )}
    </div>
  );
};
