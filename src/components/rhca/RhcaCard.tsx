
import React, { useState, useEffect } from 'react';
import { Card, CardContent as CardContentUI } from "@/components/ui/card";
import { getStorageUrl } from "@/integrations/supabase/client";
import { CoverImage } from "./card/CoverImage";
import { CardContent } from "./card/CardContent";
import type { RhcaArticle } from "./types";

// Check if we're in debug mode
const isDebugMode = process.env.NODE_ENV === 'development' || 
                   process.env.VITE_APP_PREVIEW === 'true' || 
                   process.env.DEBUG === 'true';

interface RhcaCardProps {
  article: RhcaArticle;
}

export const RhcaCard: React.FC<RhcaCardProps> = ({ article }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  useEffect(() => {
    const loadResources = async () => {
      try {
        setImageLoading(true);
        
        // Debug logs only in debug mode
        if (isDebugMode) {
          console.log(`[RhcaCard] Article ${article.id} cover filename:`, article.coverImageFileName);
        }
        
        // Load cover image
        if (article.coverImageFileName) {
          const publicUrl = getStorageUrl('rhca_covers', article.coverImageFileName);
          setCoverUrl(publicUrl);
        } 
        // Fallback to image_url if available
        else if (article.image_url) {
          setCoverUrl(article.image_url);
        } 
        // If no image is available, use null
        else {
          setCoverUrl(null);
        }
        
        // Load PDF URL
        if (article.pdfFileName) {
          const publicUrl = getStorageUrl('rhca-pdfs', article.pdfFileName);
          setPdfUrl(publicUrl);
        } else {
          setPdfUrl(null);
        }
      } catch (error) {
        if (isDebugMode) {
          console.error('[RhcaCard] Error loading resources:', error);
        }
        setCoverUrl(null);
        setPdfUrl(null);
      } finally {
        setImageLoading(false);
      }
    };
    
    loadResources();
  }, [article]);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col md:flex-row min-h-[180px] max-h-[240px] md:min-h-[220px] md:max-h-[240px] w-full md:max-w-[480px]">
      <div className="w-full md:w-[35%] min-h-[140px] md:h-auto flex-shrink-0 p-2 flex items-center justify-center">
        <CoverImage 
          article={article} 
          coverUrl={coverUrl} 
          pdfUrl={pdfUrl} 
          imageLoading={imageLoading} 
        />
      </div>
      
      <CardContentUI className="p-3 w-full md:w-[65%] flex-grow flex flex-col overflow-hidden">
        <CardContent article={article} pdfUrl={pdfUrl} />
      </CardContentUI>
    </Card>
  );
};

// Also export as default for direct imports
export default RhcaCard;
