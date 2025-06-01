import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadPDF } from "@/lib/analytics/download";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { ShareAction } from "@/components/index-medicus/article/actions/ShareAction";
import { handleMobileDownload, getMobileDownloadInstructions } from "@/lib/mobile/download-handler";
import { useIsMobile } from "@/hooks/use-mobile";
import type { RhcaArticle } from "../types";

interface CardActionsProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardActions: React.FC<CardActionsProps> = ({ article, pdfUrl }) => {
  const isMobile = useIsMobile();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    console.log('Download initiated for RHCA article:', article.id);
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour le moment");
      return;
    }
    
    try {
      // Generate a proper filename
      const fileName = `RHCA-${article.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.pdf";
      
      console.log('Attempting download with filename:', fileName);
      
      if (isMobile) {
        // Use mobile-optimized download handler
        const success = await handleMobileDownload(
          pdfUrl,
          fileName,
          async () => {
            // Success callback
            toast.success("Téléchargement réussi");
            
            // Update download count in articles table
            const { error } = await supabase
              .from('articles')
              .update({ downloads: (article.downloads || 0) + 1 })
              .eq('id', article.id);
            
            if (error) {
              console.error('Error updating download count:', error);
            }
          },
          (error) => {
            console.error('Mobile download failed:', error);
            toast.error("Une erreur est survenue lors du téléchargement");
          }
        );
        
        // Show mobile-specific instructions
        if (success) {
          setTimeout(() => {
            toast.info(getMobileDownloadInstructions(), {
              duration: 5000
            });
          }, 1000);
        }
      } else {
        // Use the standardized downloadPDF function for desktop
        const success = await downloadPDF({
          url: pdfUrl,
          fileName,
          documentId: article.id,
          documentType: DocumentType.RHCA,
          trackingEnabled: true
        });
        
        if (success) {
          toast.success("Téléchargement du PDF en cours...");
          
          // Update download count in articles table
          const { error } = await supabase
            .from('articles')
            .update({ downloads: (article.downloads || 0) + 1 })
            .eq('id', article.id);
          
          if (error) {
            console.error('Error updating download count:', error);
          }
        } else {
          toast.error("Une erreur est survenue lors du téléchargement");
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <div className="flex items-center gap-1">
        <div className="h-5 w-5">
          <ShareAction 
            articleId={article.id} 
            articleTitle={article.title}
          />
        </div>
        
        {pdfUrl && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              className="h-5 w-5 p-0 border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              onClick={handleOpenPdf}
            >
              <ExternalLink className="h-2.5 w-2.5" />
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="h-5 w-5 p-0 bg-primary text-white hover:bg-primary/90 transition-all duration-200"
              onClick={handleDownload}
            >
              <Download className="h-2.5 w-2.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
