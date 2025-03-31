
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";
import { RhcaArticle } from "../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('RhcaPreviewModal');

interface RhcaPreviewModalProps {
  article: RhcaArticle;
  pdfUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RhcaPreviewModal: React.FC<RhcaPreviewModalProps> = ({
  article,
  pdfUrl,
  isOpen,
  onClose
}) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour le moment");
      return;
    }
    
    try {
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
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    
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
          console.error('[RhcaPreviewModal] Error incrementing share count:', error);
        }
      }).catch(error => {
        console.error('[RhcaPreviewModal] Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] flex flex-col p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{article.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {pdfUrl ? (
            <iframe 
              src={`${pdfUrl}#toolbar=0`} 
              className="w-full h-[70vh]" 
              title={article.title}
            />
          ) : (
            <div className="w-full h-[70vh] flex items-center justify-center">
              <p className="text-gray-500">Le PDF n'est pas disponible pour le moment</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end items-center gap-2 p-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="gap-2"
            onClick={handleDownload}
            disabled={!pdfUrl}
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
