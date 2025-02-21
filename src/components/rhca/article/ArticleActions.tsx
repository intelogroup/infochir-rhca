
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
    
    if (!pdfFileName) {
      toast.error("PDF non disponible");
      return;
    }

    setIsDownloading(true);

    try {
      const { data, error } = await supabase
        .storage
        .from('rhca-pdfs')
        .download(pdfFileName);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data received');
      }

      // Create URL for the blob
      const url = window.URL.createObjectURL(data);
      
      // Create link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
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
