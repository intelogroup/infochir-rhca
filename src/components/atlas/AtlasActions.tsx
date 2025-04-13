import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { downloadPDF } from "@/lib/analytics/download";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('AtlasActions');

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
      // Use our enhanced download function
      const fileName = `ADC-Chapter.pdf`;
      
      const success = await downloadPDF({
        url: pdfUrl,
        fileName,
        documentId: id,
        documentType: DocumentType.ADC,
        trackingEnabled: true
      });
      
      if (!success) {
        throw new Error('Download failed');
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
