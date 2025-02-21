
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Starting download for file:', pdfFileName);
    
    if (!pdfFileName) {
      console.log('No PDF filename provided');
      toast.error("PDF non disponible");
      return;
    }

    setIsDownloading(true);

    try {
      // Get the public URL for the file
      const { data: { publicUrl }, error: urlError } = supabase
        .storage
        .from('rhca-pdfs')
        .getPublicUrl(pdfFileName);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        toast.error("Erreur lors de l'accès au fichier");
        return;
      }

      console.log('Fetching PDF from public URL:', publicUrl);

      // Fetch the file from the public URL
      const response = await fetch(publicUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      console.log('Download completed successfully');
      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error details:', {
        error,
        fileName: pdfFileName,
        timestamp: new Date().toISOString()
      });

      if (error instanceof Error) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error("Une erreur inattendue est survenue lors du téléchargement");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex-1 lg:flex-none gap-2 bg-white hover:bg-gray-50"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label={pdfFileName ? "Télécharger le PDF" : "PDF non disponible"}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span>{isDownloading ? "Chargement..." : "PDF"}</span>
    </Button>
  );
};
