
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Article } from "@/components/index-medicus/types";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";
import { DocumentType } from "@/lib/analytics/download/statistics/types";

const logger = createLogger('PdfActions');

interface PdfActionsProps {
  article: Article;
  pdfUrl: string | null;
}

export const PdfActions: React.FC<PdfActionsProps> = ({ article, pdfUrl }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('Download initiated for article:', article.id, 'URL:', pdfUrl);
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour le moment");
      return;
    }
    
    try {
      // Track download in database first
      const { error } = await supabase
        .from('articles')
        .update({ downloads: (article.downloads || 0) + 1 })
        .eq('id', article.id);
      
      if (error) {
        console.error('Error updating download count:', error);
      }
      
      // Generate a proper filename
      const fileName = `${article.source}-${article.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.pdf`;
      
      console.log('Attempting download with filename:', fileName);
      
      // For Index Medicus articles, use INDEX document type
      const documentType = article.source === 'INDEX' ? DocumentType.INDEX : 
                          article.source === 'RHCA' ? DocumentType.RHCA : 
                          article.source === 'IGM' ? DocumentType.IGM : 
                          DocumentType.Article;
      
      // Use the standardized downloadPDF function with tracking
      const success = await downloadPDF({
        url: pdfUrl,
        fileName,
        documentId: article.id,
        documentType,
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
    } catch (error) {
      logger.error('Download error:', error);
      console.error('Full download error:', error);
      
      // Fallback: try direct link opening
      try {
        window.open(pdfUrl, '_blank');
        toast.success("Ouverture du PDF dans un nouvel onglet...");
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error("Une erreur est survenue lors du téléchargement");
      }
    }
  };

  return (
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
  );
};
