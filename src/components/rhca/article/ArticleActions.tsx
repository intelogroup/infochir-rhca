
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ExternalLink } from "lucide-react";
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

    setIsLoading(true);

    try {
      console.log(`[ArticleActions] Attempting to download PDF: ${pdfFileName}`);
      
      // Download the file
      const { data, error } = await supabase
        .storage
        .from('rhca-pdfs')
        .download(pdfFileName);

      if (error) {
        console.error('Download error:', error);
        toast.error("Erreur lors du téléchargement du fichier");
        return;
      }

      if (!data) {
        toast.error("Le fichier PDF n'existe pas");
        return;
      }

      // Create URL and trigger download
      const url = window.URL.createObjectURL(data);
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

  // If no PDF is available, show disabled button
  if (!pdfFileName) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex-1 lg:flex-none gap-2 bg-white text-gray-400 border-gray-200 cursor-not-allowed"
        disabled
        aria-label="PDF non disponible"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span>PDF non disponible</span>
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
