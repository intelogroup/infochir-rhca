
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RhcaArticle } from "../types";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('RhcaCardActions');

interface CardActionsProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardActions: React.FC<CardActionsProps> = ({ article, pdfUrl }) => {
  const handleDownload = async () => {
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
        documentType: 'rhca',
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
  
  const handleShare = () => {
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
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2"
        onClick={handleDownload}
        disabled={!pdfUrl}
      >
        <Download className="h-4 w-4 mr-1" />
        PDF
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="h-8 px-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4 mr-1" />
        Partager
      </Button>
    </div>
  );
};
