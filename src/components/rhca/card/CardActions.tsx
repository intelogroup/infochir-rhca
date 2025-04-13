
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RhcaArticle } from "../types";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { DocumentType } from "@/lib/analytics/download/statistics/types";

const logger = createLogger('RhcaCardActions');

interface CardActionsProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardActions: React.FC<CardActionsProps> = ({ article, pdfUrl }) => {
  const isMobile = useIsMobile();
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the card
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour le moment");
      return;
    }
    
    try {
      // Use the standardized downloadPDF function with tracking
      const fileName = `RHCA-${article.title.slice(0, 30)}.pdf`;
      
      const success = await downloadPDF({
        url: pdfUrl,
        fileName,
        documentId: article.id,
        documentType: DocumentType.RHCA,
        trackingEnabled: true
      });
      
      if (!success) {
        throw new Error('Download failed');
      }
    } catch (error) {
      logger.error(error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the card
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.abstract || "Découvrez cet article de la RHCA",
        url: window.location.href
      }).then(() => {
        // Track share count
        try {
          supabase.rpc('increment_count', { 
            table_name: 'articles', 
            column_name: 'shares', 
            row_id: article.id 
          });
        } catch (error) {
          console.error('[RhcaCard] Error incrementing share count:', error);
        }
      }).catch(error => {
        console.error('[RhcaCard] Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "default"}
        className={isMobile ? "h-9 px-2 py-1 text-xs w-full sm:w-auto" : "h-8 px-2"}
        onClick={handleDownload}
        disabled={!pdfUrl}
      >
        <Download className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
        PDF
      </Button>
      
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "default"}
        className={isMobile ? "h-9 px-2 py-1 text-xs w-full sm:w-auto" : "h-8 px-2"}
        onClick={handleShare}
      >
        <Share2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
        Partager
      </Button>
    </div>
  );
};
