
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArticleActionsProps {
  id: string;
  volume: string;
  date: string;
  pdfFileName?: string;
  onCardClick?: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({ 
  id, 
  volume,
  date,
  pdfFileName,
  onCardClick 
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Input validation
    if (!pdfFileName) {
      toast.error("PDF non disponible");
      console.error("Download attempted without PDF filename for article:", id);
      return;
    }

    setIsDownloading(true);
    console.log(`Starting download for file: ${pdfFileName}`);

    try {
      const { data, error } = await supabase
        .storage
        .from('rhca-pdfs')
        .download(pdfFileName);

      if (error) {
        console.error('Supabase storage error:', error);
        
        // Check error message content instead of status code
        if (error.message.includes('does not exist')) {
          toast.error("Le fichier PDF n'a pas été trouvé");
          return;
        }
        if (error.message.includes('permission denied')) {
          toast.error("Accès non autorisé au fichier");
          return;
        }
        throw error;
      }

      if (!data) {
        console.error('No data received from Supabase for file:', pdfFileName);
        toast.error("Le fichier est vide ou corrompu");
        return;
      }

      console.log(`File downloaded successfully, size: ${data.size} bytes`);

      try {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(data);
        console.log('Blob URL created successfully');
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = pdfFileName;
        document.body.appendChild(link);
        
        // Trigger the download
        link.click();
        console.log('Download triggered');
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        console.log('Resources cleaned up');
        
        toast.success("Téléchargement réussi");
      } catch (browserError) {
        console.error('Browser download error:', browserError);
        toast.error("Erreur lors de la préparation du téléchargement");
      }
    } catch (error) {
      console.error('Unhandled download error:', error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsDownloading(false);
      console.log('Download process completed');
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
        onClick={handleView}
      >
        <Copy className="h-4 w-4" />
        <span className="hidden sm:inline">Voir</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isDownloading ? "Chargement..." : "PDF"}
        </span>
      </Button>
    </div>
  );
};
