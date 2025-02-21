
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
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  // Get the PDF URL when the component mounts
  React.useEffect(() => {
    const getPdfUrl = async () => {
      if (!pdfFileName) {
        console.log('No PDF filename provided for article:', id);
        return;
      }

      const { data } = supabase
        .storage
        .from('rhca-pdfs')
        .getPublicUrl(pdfFileName);

      if (data?.publicUrl) {
        setPdfUrl(data.publicUrl);
        console.log('PDF URL generated:', data.publicUrl);
      } else {
        console.log('Could not generate URL for:', pdfFileName);
      }
    };

    getPdfUrl();
  }, [pdfFileName, id]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }

    setIsDownloading(true);
    try {
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
      toast.success("Ouverture du PDF en cours...");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setIsDownloading(false);
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
        disabled={isDownloading || !pdfUrl}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isDownloading ? "Chargement..." : "PDF"}
        </span>
      </Button>
    </div>
  );
};
