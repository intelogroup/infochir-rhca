
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AtlasActionsProps {
  id: string;
  pdfUrl?: string;
}

export const AtlasActions: React.FC<AtlasActionsProps> = ({ 
  id,
  pdfUrl
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }

    setIsDownloading(true);

    try {
      // Simple direct download using the pdfUrl
      const { data, error } = await supabase
        .storage
        .from('atlas-pdfs')
        .download(pdfUrl);

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
      link.download = pdfUrl;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Update download count
      const { error: updateError } = await supabase
        .from('articles')
        .update({ 
          downloads: 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating download count:', updateError);
      }

      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);
    try {
      const shareUrl = `${window.location.origin}/atlas/chapters/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié dans le presse-papier");
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-white hover:bg-gray-50"
        onClick={handleShare}
        disabled={isSharing}
      >
        <Share2 className="h-4 w-4" />
        <span>Partager</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-white hover:bg-gray-50"
        onClick={handleDownload}
        disabled={isDownloading || !pdfUrl}
      >
        <Download className="h-4 w-4" />
        <span>{isDownloading ? "Chargement..." : "PDF"}</span>
      </Button>
    </div>
  );
};
