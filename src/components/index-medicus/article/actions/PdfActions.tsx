
import React, { useEffect, useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { validateFileExists } from "./utils/fileValidation";
import { PdfButtonGroup } from "./components/PdfButtonGroup";
import { PdfDropdownMenu } from "./components/PdfDropdownMenu";

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

  useEffect(() => {
    const checkFileExistence = async () => {
      if (!pdfUrl) {
        setFileExists(false);
        return;
      }

      const exists = await validateFileExists(pdfUrl);
      setFileExists(exists);
    };

    checkFileExistence();
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
    
    if (articleId) {
      // Fix the promise handling by using then/catch properly
      supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'views',
        row_id: articleId
      })
        .then(({ error }) => {
          if (error) {
            throw error;
          }
          logger.log("View count incremented");
        })
        .catch(err => {
          logger.error("Failed to increment view count:", err);
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
      const fileName = title ? `${title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.pdf` : 'article.pdf';
      
      const success = await downloadPDF({
        url: pdfUrl,
        fileName: fileName,
        documentId: articleId || 'unknown',
        documentType: DocumentType.INDEX,
        trackingEnabled: !!articleId
      });
      
      if (!success) {
        throw new Error('Download failed');
      }
      
      toast.success("Téléchargement du PDF réussi");
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
  
  // Render mobile version or desktop version based on screen size
  return isMobile ? (
    <PdfButtonGroup 
      isLoading={isLoading}
      handleDownloadPdf={handleDownloadPdf}
      handleOpenPdf={handleOpenPdf}
    />
  ) : (
    <PdfDropdownMenu
      isLoading={isLoading}
      handleDownloadPdf={handleDownloadPdf}
      handleOpenPdf={handleOpenPdf}
    />
  );
};
