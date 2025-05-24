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
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour le moment");
      return;
    }
    
    try {
      // Track download in database
      const { error } = await supabase
        .from('articles')
        .update({ downloads: (article.downloads || 0) + 1 })
        .eq('id', article.id);
      
      if (error) {
        console.error('Error updating download count:', error);
      }
      
      // Use the standardized downloadPDF function with tracking
      const fileName = `${article.source}-${article.title.slice(0, 30)}.pdf`;
      
      const success = await downloadPDF({
        url: pdfUrl,
        fileName,
        documentId: article.id,
        documentType: article.source === 'RHCA' ? DocumentType.RHCA : DocumentType.INDEX,
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
