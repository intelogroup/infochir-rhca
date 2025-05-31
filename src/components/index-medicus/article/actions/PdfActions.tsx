
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Article } from "@/components/index-medicus/types";
import { createLogger } from "@/lib/error-logger";

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
      
      // Force actual download without fallback to opening in new tab
      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        
        toast.success("Téléchargement du PDF en cours...");
      } catch (downloadError) {
        console.error('Blob download failed:', downloadError);
        
        // Direct download fallback
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Téléchargement du PDF en cours...");
      }
    } catch (error) {
      logger.error('Download error:', error);
      console.error('Full download error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };

  return (
    <Button 
      variant="default" 
      size="sm"
      className="h-9 px-4 bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-200"
      onClick={handleDownload}
      disabled={!pdfUrl}
    >
      <Download className="h-4 w-4 mr-2" />
      PDF
    </Button>
  );
};
