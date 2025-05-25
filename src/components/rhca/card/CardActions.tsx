
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadPDF } from "@/lib/analytics/download";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { ShareAction } from "@/components/index-medicus/article/actions/ShareAction";
import type { RhcaArticle } from "../types";

interface CardActionsProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardActions: React.FC<CardActionsProps> = ({ article, pdfUrl }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    console.log('Download initiated for RHCA article:', article.id);
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour le moment");
      return;
    }
    
    try {
      // Generate a proper filename
      const fileName = `RHCA-${article.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.pdf`;
      
      console.log('Attempting download with filename:', fileName);
      
      // Use the standardized downloadPDF function with RHCA document type
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
      <ShareAction 
        articleId={article.id} 
        articleTitle={article.title}
      />
      
      {pdfUrl && (
        <Button 
          variant="outline" 
          size="sm"
          className="h-6 px-1.5 text-xs font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          onClick={handleOpenPdf}
        >
          <ExternalLink className="h-3 w-3 mr-0.5" />
          Ouvrir
        </Button>
      )}
      
      {pdfUrl && (
        <Button 
          variant="outline" 
          size="sm"
          className="h-6 px-1.5 text-xs font-medium border-primary/20 text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
          onClick={handleDownload}
        >
          <Download className="h-3 w-3 mr-0.5" />
          PDF
        </Button>
      )}
    </div>
  );
};
