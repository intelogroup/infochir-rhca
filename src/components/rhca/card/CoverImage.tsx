
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
  // imageLoading is still in the props but not used directly in the component
}) => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-t-md overflow-hidden bg-gray-100">
      <ImageOptimizer
        src={coverUrl || ''}
        alt={article.title}
        width={320}
        height={240}
        className="w-full h-full object-cover"
        fallbackText={article.title}
      />
      
      <PdfStatusIndicator 
        status={pdfUrl ? "available" : "unavailable"} 
        className="absolute top-2 right-2" 
      />
    </div>
  );
};
