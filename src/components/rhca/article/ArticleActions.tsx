
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArticleActionsProps {
  id: string;
  volume: string;
  date: string;
  onCardClick?: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({ 
  id, 
  volume,
  date,
  onCardClick 
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsDownloading(true);
    try {
      // Generate PDF filename based on article metadata
      const year = new Date(date).getFullYear();
      const month = String(new Date(date).getMonth() + 1).padStart(2, '0');
      const pdfFileName = `RHCA_${year}_${month}.pdf`;
      
      // Get public URL from Supabase storage
      const { data: publicUrl } = supabase
        .storage
        .from('rhca-pdfs')
        .getPublicUrl(pdfFileName);

      if (!publicUrl?.publicUrl) {
        throw new Error('Could not generate public URL');
      }

      // Open the public URL in a new tab
      window.open(publicUrl.publicUrl, '_blank');
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
