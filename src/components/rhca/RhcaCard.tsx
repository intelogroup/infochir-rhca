
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardContent as CardContentUI } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CoverImage } from "./card/CoverImage";
import { CardContent } from "./card/CardContent";
import type { RhcaArticle } from "./types";

interface RhcaCardProps {
  article: RhcaArticle;
}

export const RhcaCard = memo(({ article }: RhcaCardProps) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Memoize the storage key for the article
  const articleStorageKey = useMemo(() => 
    `rhca-article-${article.id}`, 
    [article.id]
  );
  
  const loadCoverImage = useCallback(async () => {
    try {
      setImageLoading(true);
      console.log(`[RhcaCard] Article ${article.id} cover filename:`, article.coverImageFileName);
      
      // First try to get the cover image from storage if we have a filename
      if (article.coverImageFileName) {
        const { data } = await supabase.storage
          .from('rhca_covers')
          .getPublicUrl(article.coverImageFileName);
          
        console.log(`[RhcaCard] Cover image URL from storage:`, data.publicUrl);
        setCoverUrl(data.publicUrl);
      } 
      // Fallback to image_url if available
      else if (article.image_url) {
        console.log(`[RhcaCard] Using image_url fallback:`, article.image_url);
        setCoverUrl(article.image_url);
      } 
      // If no image is available, use a placeholder
      else {
        console.log(`[RhcaCard] No cover image available for article ${article.id}`);
        setCoverUrl(null);
      }
    } catch (error) {
      console.error('[RhcaCard] Error loading cover image:', error);
      setCoverUrl(null);
    } finally {
      setImageLoading(false);
    }
  }, [article.id, article.coverImageFileName, article.image_url]);
  
  const loadPdfUrl = useCallback(async () => {
    try {
      if (article.pdfFileName) {
        const { data } = await supabase.storage
          .from('rhca-pdfs')
          .getPublicUrl(article.pdfFileName);
          
        setPdfUrl(data.publicUrl);
      } else {
        setPdfUrl(null);
      }
    } catch (error) {
      console.error('[RhcaCard] Error loading PDF URL:', error);
      setPdfUrl(null);
    }
  }, [article.pdfFileName]);
  
  useEffect(() => {
    // Load URLs in parallel
    Promise.all([
      loadCoverImage(),
      loadPdfUrl()
    ]).catch(error => {
      console.error('[RhcaCard] Error in parallel loading:', error);
    });
    
    // No cleanup needed for these operations
  }, [loadCoverImage, loadPdfUrl]);
  
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
});

RhcaCard.displayName = 'RhcaCard';

// Also export as default for direct imports
export default RhcaCard;
