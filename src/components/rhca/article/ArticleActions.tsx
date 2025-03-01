
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
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
      console.log(`[ArticleActions] Attempting to download PDF: ${pdfFileName}`);
      
      // First check if the file exists in storage
      const { data: publicUrlData } = await supabase
        .storage
        .from('rhca-pdfs')
        .getPublicUrl(pdfFileName);
        
      if (!publicUrlData.publicUrl) {
        console.error('PDF URL could not be generated');
        toast.error("Le PDF n'a pas pu être trouvé");
        return;
      }

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

      // Update download count using increment_count function
      const { error: updateError } = await supabase
        .rpc('increment_count', { 
          table_name: 'rhca_articles_view',
          column_name: 'downloads',
          row_id: id
        });

      if (updateError) {
        console.error('Error updating download count:', updateError);
      } else {
        console.log(`[ArticleActions] Successfully updated download count for article ${id}`);
      }

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
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{isDownloading ? "Chargement..." : "PDF"}</span>
    </Button>
  );
};
