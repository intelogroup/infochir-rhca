
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  checkFileExistsInBucket, 
  openFileInNewTab, 
  downloadFileFromStorage 
} from "@/lib/pdf-utils";

interface ArticleActionsProps {
  id: string;
  volume: string;
  date: string;
  pdfFileName?: string;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({ 
  id,
  pdfFileName
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileExists, setFileExists] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const BUCKET_NAME = 'rhca-pdfs';

  // Check if the file exists in storage
  React.useEffect(() => {
    let isMounted = true;
    const verifyFileExists = async () => {
      setError(null);
      
      if (!pdfFileName) {
        console.log(`[ArticleActions:INFO] No PDF filename provided for article ${id}`);
        if (isMounted) {
          setFileExists(false);
        }
        return;
      }

      try {
        console.log(`[ArticleActions:INFO] Checking if PDF exists: ${pdfFileName} for article ${id}`);
        const exists = await checkFileExistsInBucket(BUCKET_NAME, pdfFileName);
        console.log(`[ArticleActions:INFO] PDF existence check result: ${exists} for file ${pdfFileName}`);
        
        if (isMounted) {
          setFileExists(exists);
          if (!exists) {
            setError(`Le fichier "${pdfFileName}" n'existe pas`);
          }
        }
      } catch (err) {
        console.error(`[ArticleActions:ERROR] Error checking if file exists:`, err);
        if (isMounted) {
          setFileExists(false);
          setError(`Erreur lors de la vérification: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };

    verifyFileExists();
    
    return () => {
      isMounted = false;
    };
  }, [pdfFileName, id]);

  // Function to increment download/view counter
  const incrementCounter = async (articleId: string, countType: 'downloads' | 'views') => {
    try {
      console.log(`[ArticleActions:INFO] Incrementing ${countType} count for article ${articleId}`);
      const { error } = await supabase
        .rpc('increment_count', { 
          table_name: 'rhca_articles_view',
          column_name: countType,
          row_id: articleId
        });

      if (error) {
        console.error(`[ArticleActions:ERROR] Error updating ${countType} count:`, error);
        console.error(`Error details: ${error.message}`);
        throw new Error(`Failed to update ${countType} count: ${error.message}`);
      } else {
        console.log(`[ArticleActions:SUCCESS] Successfully updated ${countType} count for article ${articleId}`);
      }
    } catch (err) {
      console.error(`[ArticleActions:ERROR] Failed to increment ${countType} count:`, err);
      console.error(`Error details: ${err instanceof Error ? err.message : String(err)}`);
      throw err; // Re-throw to be handled by the caller
    }
  };

  // Handle opening PDF in a new tab
  const handleOpenInNewTab = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pdfFileName) {
      toast.error("PDF non disponible");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await openFileInNewTab(BUCKET_NAME, pdfFileName, id, incrementCounter);
    } catch (err) {
      console.error(`[ArticleActions:ERROR] Error opening file in new tab:`, err);
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle downloading the PDF file
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pdfFileName) {
      toast.error("PDF non disponible");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await downloadFileFromStorage(BUCKET_NAME, pdfFileName, id, incrementCounter);
    } catch (err) {
      console.error(`[ArticleActions:ERROR] Error downloading file:`, err);
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Show PDF download/view status
  if (fileExists === null) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex-1 lg:flex-none gap-2 bg-white"
        disabled
        aria-label="Vérification de la disponibilité du PDF"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Vérification...</span>
      </Button>
    );
  }

  // If no PDF is available or it doesn't exist in storage, show disabled button
  if (!pdfFileName || fileExists === false) {
    return (
      <div className="space-y-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 lg:flex-none gap-2 bg-white text-gray-400 border-gray-200 cursor-not-allowed"
          disabled
          aria-label="PDF non disponible"
        >
          {fileExists === false ? (
            <>
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span>PDF manquant</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>PDF non disponible</span>
            </>
          )}
        </Button>
        {error && (
          <p className="text-xs text-red-500 truncate max-w-[200px]" title={error}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 lg:flex-none gap-2 bg-white hover:bg-gray-50"
            disabled={isLoading}
            aria-label="Options PDF"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{isLoading ? "Chargement..." : "PDF"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir dans un nouvel onglet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && (
        <p className="text-xs text-red-500 truncate max-w-[200px]" title={error}>
          {error}
        </p>
      )}
    </div>
  );
};
