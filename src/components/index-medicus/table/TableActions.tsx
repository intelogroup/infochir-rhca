
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  checkFileExistsInBucket, 
  extractFilenameFromUrl, 
  openFileInNewTab, 
  downloadFileFromStorage 
} from "@/lib/pdf-utils";

interface TableActionsProps {
  articleId: string;
  pdfUrl?: string;
}

export const TableActions = ({ articleId, pdfUrl }: TableActionsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const BUCKET_NAME = 'article-pdfs';

  // Extract filename from URL
  const pdfFileName = extractFilenameFromUrl(pdfUrl);
  
  // Check if file exists when component mounts
  useEffect(() => {
    const verifyFileExists = async () => {
      // For external URLs assume they exist unless proven otherwise
      if (!pdfFileName) {
        setFileExists(false);
        return;
      }
      
      if (pdfUrl?.includes('article-pdfs')) {
        setFileExists(await checkFileExistsInBucket(BUCKET_NAME, pdfFileName));
      } else if (pdfUrl) {
        // For external URLs, try a HEAD request
        try {
          const response = await fetch(pdfUrl, { method: 'HEAD' });
          setFileExists(response.ok);
        } catch (err) {
          console.error('Failed to check external URL:', err);
          setFileExists(false);
        }
      } else {
        setFileExists(false);
      }
    };

    verifyFileExists();
  }, [pdfUrl, pdfFileName]);

  // Function to increment counts
  const incrementCounter = async (id: string, countType: 'downloads' | 'views') => {
    try {
      const { error } = await supabase.rpc('increment_count', { 
        table_name: 'igm_articles_view',
        column_name: countType,
        row_id: id
      });
      
      if (error) {
        console.error(`Failed to increment ${countType} count:`, error);
      }
    } catch (error) {
      console.error(`Error in increment counter:`, error);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/index-medicus/articles/${articleId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
    
    // Try to increment share count
    supabase.rpc('increment_count', { 
      table_name: 'igm_articles_view',
      column_name: 'shares',
      row_id: articleId
    }).catch(error => {
      console.error('Failed to increment share count:', error);
    });
  };

  const handleOpenPdf = async () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }

    setIsDownloading(true);
    
    try {
      if (pdfUrl.includes('article-pdfs') && pdfFileName) {
        await openFileInNewTab(BUCKET_NAME, pdfFileName, articleId, incrementCounter);
      } else {
        // External URL handling
        window.open(pdfUrl, '_blank');
        await incrementCounter(articleId, 'views');
        toast.success("Ouverture du PDF...");
      }
    } catch (error) {
      console.error('PDF open error:', error);
      toast.error("Erreur lors de l'ouverture du PDF");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }

    setIsDownloading(true);
    
    try {
      if (pdfUrl.includes('article-pdfs') && pdfFileName) {
        await downloadFileFromStorage(BUCKET_NAME, pdfFileName, articleId, incrementCounter);
      } else {
        // Handle external URL download
        const response = await fetch(pdfUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const fileName = pdfFileName || `article-${articleId}.pdf`;
        
        // Create an invisible link to download the file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Increment download counter
        await incrementCounter(articleId, 'downloads');
        
        toast.success("Téléchargement réussi");
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  // If we're still checking if the file exists
  if (fileExists === null && pdfUrl) {
    return (
      <div className="flex justify-end items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="hover:bg-muted"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="hover:bg-muted"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`/index-medicus/articles/${articleId}`, '_blank')}
          className="hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="hover:bg-muted"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      {(pdfUrl && fileExists) ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-muted"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
      ) : pdfUrl ? (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="hover:bg-muted"
          title="PDF non disponible"
        >
          <AlertCircle className="h-4 w-4" />
        </Button>
      ) : null}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(`/index-medicus/articles/${articleId}`, '_blank')}
        className="hover:bg-muted"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};
