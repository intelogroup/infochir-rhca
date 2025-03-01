
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

  // Check if the file exists in storage
  React.useEffect(() => {
    const checkFileExists = async () => {
      if (!pdfFileName) {
        setFileExists(false);
        return;
      }

      try {
        // First try to get the head of the file to check if it exists
        const { data, error } = await supabase
          .storage
          .from('rhca-pdfs')
          .list('', {
            search: pdfFileName
          });

        if (error) {
          console.error('Error checking file existence:', error);
          setFileExists(false);
          return;
        }

        // If we found the file in the list, it exists
        setFileExists(data && data.some(file => file.name === pdfFileName));
      } catch (err) {
        console.error('Failed to check file existence:', err);
        setFileExists(false);
      }
    };

    checkFileExists();
  }, [pdfFileName]);

  // Function to increment download/view counter
  const incrementCounter = async (countType: 'downloads' | 'views') => {
    try {
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

  // Get the public URL for the PDF
  const getPdfPublicUrl = (): string | null => {
    if (!pdfFileName) return null;
    
    const { data } = supabase
      .storage
      .from('rhca-pdfs')
      .getPublicUrl(pdfFileName);
      
    return data?.publicUrl || null;
  };

  // Handle opening PDF in a new tab
  const handleOpenInNewTab = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pdfFileName) {
      toast.error("PDF non disponible");
      return;
    }

    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
      return;
    }

    setIsLoading(true);

    try {
      const publicUrl = getPdfPublicUrl();
      
      if (!publicUrl) {
        toast.error("Impossible d'ouvrir le PDF");
        return;
      }

      // Open in new tab
      window.open(publicUrl, '_blank');
      
      // Increment view counter
      await incrementCounter('views');
      
      toast.success("PDF ouvert dans un nouvel onglet");
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error("Erreur lors de l'ouverture du PDF");
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

    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
      return;
    }

    setIsLoading(true);

    try {
      console.log(`[ArticleActions] Attempting to download PDF: ${pdfFileName}`);
      
      // Try using getPublicUrl and then downloading through that URL
      // This is more reliable than using the storage.download method directly
      const { data: urlData } = supabase
        .storage
        .from('rhca-pdfs')
        .getPublicUrl(pdfFileName);
        
      if (!urlData || !urlData.publicUrl) {
        toast.error("Impossible d'obtenir l'URL du PDF");
        return;
      }
      
      // Fetch the file using the public URL
      const response = await fetch(urlData.publicUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Update download count
      await incrementCounter('downloads');

      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
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
