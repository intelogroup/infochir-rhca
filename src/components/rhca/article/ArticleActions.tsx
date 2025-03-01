
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
  const BUCKET_NAME = 'rhca-pdfs';

  // Check if the file exists in storage
  React.useEffect(() => {
    const verifyFileExists = async () => {
      if (!pdfFileName) {
        console.log(`[ArticleActions] No PDF filename provided for article ${id}`);
        setFileExists(false);
        return;
      }

      console.log(`[ArticleActions] Checking if PDF exists: ${pdfFileName}`);
      const exists = await checkFileExistsInBucket(BUCKET_NAME, pdfFileName);
      console.log(`[ArticleActions] PDF exists check result: ${exists} for file ${pdfFileName}`);
      setFileExists(exists);
    };

    verifyFileExists();
  }, [pdfFileName, id]);

  // Function to increment download/view counter
  const incrementCounter = async (countType: 'downloads' | 'views') => {
    try {
      console.log(`[ArticleActions] Incrementing ${countType} count for article ${id}`);
      const { error } = await supabase
        .rpc('increment_count', { 
          table_name: 'rhca_articles_view',
          column_name: countType,
          row_id: id
        });

      if (error) {
        console.error(`Error updating ${countType} count:`, error);
      } else {
        console.log(`[ArticleActions] Successfully updated ${countType} count for article ${id}`);
      }
    } catch (err) {
      console.error(`Failed to increment ${countType} count:`, err);
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
    try {
      await openFileInNewTab(BUCKET_NAME, pdfFileName, id, incrementCounter);
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
    try {
      await downloadFileFromStorage(BUCKET_NAME, pdfFileName, id, incrementCounter);
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
    );
  }

  return (
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
  );
};
