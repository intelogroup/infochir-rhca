
import React, { useState, useEffect } from 'react';
import { Card, CardContent as CardContentUI } from "@/components/ui/card";
import { getStorageUrl } from "@/integrations/supabase/client";

// Debug mode check
const isDebugMode = import.meta.env.DEV;
import { CoverImage } from "./card/CoverImage";
import { CardContent } from "./card/CardContent";
import { RhcaArticleModal } from "./article/RhcaArticleModal";
import type { RhcaArticle } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('RhcaCard');

interface RhcaCardProps {
  article: RhcaArticle;
}

export const RhcaCard: React.FC<RhcaCardProps> = ({ article }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadResources = async () => {
      try {
        setImageLoading(true);
        
        logger.log(`[RhcaCard] Loading resources for article ${article.id}`);
        logger.log(`[RhcaCard] Cover image filename: ${article.coverImageFileName}`);
        
        // Load cover image with priority order: image_url > coverImageFileName > generated filename
        if (article.image_url) {
          // Prioritize image_url since it's most reliable from database
          setCoverUrl(article.image_url);
          logger.log(`[RhcaCard] Using image_url: ${article.image_url}`);
        }
        else if (article.coverImageFileName) {
          // Try primary bucket
          const publicUrl = getStorageUrl('rhca_covers', article.coverImageFileName);
          setCoverUrl(publicUrl);
          logger.log(`[RhcaCard] Cover URL from rhca_covers: ${publicUrl}`);
        }
        // If no direct URLs, generate filename from volume/issue using actual storage patterns
        else if (article.volume && article.issue && article.publicationDate) {
          const paddedVolume = String(article.volume).padStart(2, '0');
          const issueDate = new Date(article.publicationDate);
          
          if (!isNaN(issueDate.getTime())) {
            const day = String(issueDate.getDate()).padStart(1, '0');
            const month = String(issueDate.getMonth() + 1).padStart(1, '0');
            const year = issueDate.getFullYear();
            
            // Try date-based pattern that matches actual storage
            const generatedFilename = `RHCA_vol_${paddedVolume}_no_${article.issue}_${day}_${month}_${year}.png`;
            const publicUrl = getStorageUrl('rhca_covers', generatedFilename);
            
            if (isDebugMode) {
              console.log(`[RhcaCard] Generated date-based cover URL: ${publicUrl}`);
            }
            
            setCoverUrl(publicUrl);
            logger.log(`[RhcaCard] Using generated date-based filename: ${generatedFilename}`);
          }
        } 
        // If no image is available, use null
        else {
          setCoverUrl(null);
          logger.warn(`[RhcaCard] No cover image available for article ${article.id}`);
        }
        
        // Load PDF URL
        if (article.pdfFileName) {
          const publicUrl = getStorageUrl('rhca-pdfs', article.pdfFileName);
          setPdfUrl(publicUrl);
          logger.log(`[RhcaCard] PDF URL: ${publicUrl}`);
        } else {
          setPdfUrl(null);
          logger.warn(`[RhcaCard] No PDF available for article ${article.id}`);
        }
      } catch (error) {
        logger.error('[RhcaCard] Error loading resources:', error);
        setCoverUrl(null);
        setPdfUrl(null);
      } finally {
        setImageLoading(false);
      }
    };
    
    loadResources();
  }, [article]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open the modal if clicking the card itself, not the buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Card 
        className={`overflow-hidden transition-all hover:shadow-md flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} min-h-[180px] ${isMobile ? 'max-h-none' : 'max-h-[240px] md:min-h-[220px] md:max-h-[240px]'} w-full md:max-w-[480px] cursor-pointer`}
        onClick={handleCardClick}
      >
        <div className={`${isMobile ? 'w-full h-[140px]' : 'w-full md:w-[35%] min-h-[140px]'} md:h-auto flex-shrink-0 p-2 flex items-center justify-center`}>
          <CoverImage 
            article={article} 
            coverUrl={coverUrl} 
            pdfUrl={pdfUrl} 
            imageLoading={imageLoading} 
          />
        </div>
        
        <CardContentUI className={`p-3 w-full ${isMobile ? '' : 'md:w-[65%]'} flex-grow flex flex-col overflow-hidden`}>
          <CardContent article={article} pdfUrl={pdfUrl} />
        </CardContentUI>
      </Card>

      <RhcaArticleModal
        article={article}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={pdfUrl}
      />
    </>
  );
};

export default RhcaCard;
