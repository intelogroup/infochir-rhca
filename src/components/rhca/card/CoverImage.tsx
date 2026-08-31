import React from 'react';
import { OptimizedImageLoader } from "../../shared/OptimizedImageLoader";
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
}) => {
  return (
    <div className="w-full h-full overflow-hidden bg-muted">
      <OptimizedImageLoader
        src={coverUrl || ''}
        alt={`Couverture ${article.title}`}
        width={300}
        height={400}
        className="w-full h-full object-cover object-top"
        fallbackText="Couverture non disponible"
        loading="eager"
        priority
      />
    </div>
  );
};
