
import React, { useEffect, useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkFileExists, downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('PdfActions');

interface PdfActionsProps {
  title?: string;
  pdfUrl?: string;
  hideDownload?: boolean;
  articleId?: string;
}

export const PdfActions: React.FC<PdfActionsProps> = ({
  title = "",
  pdfUrl,
  hideDownload = false,
  articleId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileExists, setFileExists] = useState<boolean | null>(null);

  // Check if file exists when component mounts
  useEffect(() => {
    const validateFile = async () => {
      if (!pdfUrl) {
        setFileExists(false);
        return;
      }

      try {
        // For URLs in Supabase storage
        if (pdfUrl.includes('article-pdfs') || pdfUrl.includes('rhca-pdfs')) {
          const bucketName = pdfUrl.includes('article-pdfs') ? 'article-pdfs' : 'rhca-pdfs';
          const fileName = pdfUrl.split('/').pop();
          if (!fileName) {
            setFileExists(false);
            return;
          }
          
          const exists = await checkFileExists(bucketName, fileName);
          setFileExists(exists);
        } else {
          // For external URLs, try a HEAD request
          try {
            const response = await fetch(pdfUrl, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            setFileExists(response.ok);
          } catch (error) {
            logger.warn('Failed to check external PDF URL', { pdfUrl, error });
            // Assume it exists if we can't check (might be CORS issues)
            setFileExists(true);
          }
        }
      } catch (err) {
        logger.error(err, { action: 'validateFile', pdfUrl });
        setFileExists(false);
      }
    };

    validateFile();
  }, [pdfUrl]);

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }
    
    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
      return;
    }
    
    window.open(pdfUrl, '_blank');
    
    // Track the view event if we have an article ID
    if (articleId) {
      try {
        // We could add a separate tracking function for views if needed
        supabase.rpc('increment_count', {
          table_name: 'articles',
          column_name: 'views',
          row_id: articleId
        }).then(({ error }) => {
          if (error) {
            logger.warn('Failed to track PDF view', { error, articleId });
          }
        });
      } catch (error) {
        logger.warn('Error tracking PDF view', { error, articleId });
        // Don't show errors to users for analytics failures
      }
    }
    
    toast.success("PDF ouvert dans un nouvel onglet");
  };
  
  const handleDownloadPdf = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }
    
    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fileName = title ? `${title.slice(0, 30)}.pdf` : 'article.pdf';
      
      // Use our enhanced download function with tracking
      const success = await downloadPDF({
        url: pdfUrl,
        fileName: fileName,
        documentId: articleId || 'unknown',
        documentType: 'article',
        trackingEnabled: !!articleId
      });
      
      if (!success) {
        throw new Error('Download failed');
      }
    } catch (error) {
      logger.error(error, { action: 'handleDownloadPdf', pdfUrl, articleId });
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setIsLoading(false);
    }
  };

  if (hideDownload) {
    return null;
  }
  
  if (fileExists === null && pdfUrl) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Vérification...</span>
      </Button>
    );
  }
  
  if (!pdfUrl || fileExists === false) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 opacity-40 cursor-not-allowed"
        disabled
      >
        <Download className="h-4 w-4" />
        <span>PDF</span>
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleOpenPdf}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Ouvrir dans un nouvel onglet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPdf}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
