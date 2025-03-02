
import React from 'react';
import { ImageOptimizer } from "../../shared/ImageOptimizer";
import { PdfStatusIndicator } from "../../shared/PdfStatusIndicator";
import type { RhcaArticle } from "../types";

interface CoverImageProps {
  article: RhcaArticle;
  coverUrl: string | null;
  pdfUrl: string | null;
  imageLoading: boolean;
}

export const CoverImage: React.FC<CoverImageProps> = ({ 
  article, 
  coverUrl, 
  pdfUrl,
  imageLoading 
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full h-full max-h-[280px] flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
        <ImageOptimizer
          src={coverUrl || ''}
          alt={article.title}
          width={240}
          height={320}
          className="w-auto h-auto max-w-full max-h-full object-contain"
          fallbackText={article.title}
        />
      </div>
      
      <PdfStatusIndicator 
        status={pdfUrl ? "available" : "unavailable"} 
        className="absolute top-2 right-2" 
      />
    </div>
  );
};
