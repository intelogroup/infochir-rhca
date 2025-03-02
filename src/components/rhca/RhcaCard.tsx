
import React, { useState, useEffect } from 'react';
import { Card, CardContent as CardContentUI } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CoverImage } from "./card/CoverImage";
import { CardContent } from "./card/CardContent";
import type { RhcaArticle } from "./types";

interface RhcaCardProps {
  article: RhcaArticle;
}

export const RhcaCard: React.FC<RhcaCardProps> = ({ article }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  useEffect(() => {
    const loadCoverImage = async () => {
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
    };
    
    const loadPdfUrl = async () => {
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
    };
    
    loadCoverImage();
    loadPdfUrl();
  }, [article]);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex h-[320px] w-[600px]">
      <div className="w-[35%] flex-shrink-0 p-3 flex items-center justify-center">
        <CoverImage 
          article={article} 
          coverUrl={coverUrl} 
          pdfUrl={pdfUrl} 
          imageLoading={imageLoading} 
        />
      </div>
      
      <CardContentUI className="p-4 w-[65%] flex-grow overflow-hidden">
        <CardContent article={article} pdfUrl={pdfUrl} />
      </CardContentUI>
    </Card>
  );
};

// Also export as default for direct imports
export default RhcaCard;
