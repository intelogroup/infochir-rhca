
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
      console.log('Attempting to download from bucket rhca-pdfs:', pdfFileName);
      
      const { data, error } = await supabase
        .storage
        .from('rhca-pdfs')
        .download(pdfFileName);

      if (error) {
        console.error('Supabase Storage Error:', {
          errorMessage: error.message,
          errorDetails: error,
          bucket: 'rhca-pdfs',
          fileName: pdfFileName
        });
        
        // Handle specific error cases
        if (error.message?.includes('not found')) {
          toast.error("Le fichier PDF n'existe pas dans le stockage");
        } else if (error.message?.includes('permission')) {
          toast.error("Erreur d'accès au fichier - Permissions insuffisantes");
        } else if (error.message?.includes('bucket')) {
          toast.error("Erreur de configuration du stockage");
        } else {
          toast.error(`Erreur de téléchargement: ${error.message || 'Erreur inconnue'}`);
        }
        throw error;
      }

      if (!data) {
        console.error('No data received from storage');
        toast.error("Aucune donnée reçue du serveur");
        throw new Error('No data received from storage');
      }

      console.log('File downloaded successfully, creating blob URL');

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
      
      console.log('Download completed successfully');
      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error details:', {
        error,
        fileName: pdfFileName,
        timestamp: new Date().toISOString(),
        storageUrl: supabase.storage.from('rhca-pdfs').getPublicUrl(pdfFileName).data.publicUrl
      });

      if (error instanceof Error) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error("Une erreur inattendue est survenue lors du téléchargement");
      }
    } finally {
      setIsDownloading(false);
      console.log('Download process completed');
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
