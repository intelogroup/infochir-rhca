
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
          const response = await fetch(pdfUrl, { method: 'HEAD' });
          setFileExists(response.ok);
        }
      } catch (err) {
        logger.error(err);
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
      // We could add a separate tracking function for views if needed
      supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'views',
        row_id: articleId
      });
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
        documentType: 'index-medicus',
        trackingEnabled: !!articleId
      });
      
      if (!success) {
        throw new Error('Download failed');
      }
    } catch (error) {
      logger.error(error);
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
  
  // Mobile view with direct buttons
  if (isMobile) {
    return (
      <div className="flex gap-1 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 py-1 text-xs"
          onClick={handleOpenPdf}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          <span className="text-xs">Ouvrir</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 py-1 text-xs"
          onClick={handleDownloadPdf}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
          <span className="text-xs">Télécharger</span>
        </Button>
      </div>
    );
  }
  
  // Desktop view with dropdown
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
