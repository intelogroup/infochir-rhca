
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
import { trackClick } from "@/lib/analytics/track";
import { DocumentType } from "@/lib/analytics/download/statistics/types";

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
        
        // Use cover_image_filename from DB (already normalized to match storage)
        const coverFilename = article.coverImageFileName;
        if (coverFilename) {
          setCoverUrl(getStorageUrl('rhca_covers', coverFilename));
        } else if (article.image_url) {
          setCoverUrl(article.image_url);
        } else {
          setCoverUrl(null);
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

    void trackClick(article.id, DocumentType.RHCA, article.title);
    setIsModalOpen(true);
  };

  
  return (
    <>
      <Card
        className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-none border border-border bg-card transition-colors hover:border-primary/40 md:max-w-[520px] md:flex-row"
        onClick={handleCardClick}
      >
        <div className="w-full flex-shrink-0 md:w-[38%]">
          <div className="aspect-[3/4] w-full md:h-full">
            <CoverImage
              article={article}
              coverUrl={coverUrl}
              pdfUrl={pdfUrl}
              imageLoading={imageLoading}
            />
          </div>
        </div>

        <CardContentUI className="flex w-full flex-grow flex-col overflow-hidden p-4 md:w-[62%]">
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
