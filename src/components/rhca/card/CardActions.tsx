
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
      
      if (!success) {
        // Fallback: direct download
        console.log('Standard download failed, trying direct download...');
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Téléchargement du PDF en cours...");
      } else {
        toast.success("Téléchargement du PDF en cours...");
      }
      
      // Update download count in articles table
      const { error } = await supabase
        .from('articles')
        .update({ downloads: (article.downloads || 0) + 1 })
        .eq('id', article.id);
      
      if (error) {
        console.error('Error updating download count:', error);
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
    <div className="flex items-center gap-2">
      <ShareAction 
        articleId={article.id} 
        articleTitle={article.title}
      />
      
      {pdfUrl && (
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          onClick={handleOpenPdf}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Ouvrir
        </Button>
      )}
      
      {pdfUrl && (
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      )}
    </div>
  );
};
