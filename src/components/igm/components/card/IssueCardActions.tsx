
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { DocumentType } from "@/lib/analytics/download/statistics/types";

const logger = createLogger('IssueCardActions');

interface IssueCardActionsProps {
  pdfUrl?: string;
  id: string;
  title: string;
}

export const IssueCardActions: React.FC<IssueCardActionsProps> = ({
  pdfUrl,
  id,
  title
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const isMobile = useIsMobile();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour ce numéro");
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Use our enhanced download function
      const success = await downloadPDF({
        url: pdfUrl,
        fileName: `IGM_${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        documentId: id,
        documentType: DocumentType.IGM
      });
      
      if (success) {
        toast.success("Téléchargement du PDF en cours...");
      } else {
        toast.error("Erreur lors du téléchargement");
      }
    } catch (error) {
      logger.error(error);
      toast.error("Erreur lors du téléchargement", {
        description: "Veuillez réessayer plus tard"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    try {
      // Generate share URL
      const shareUrl = `${window.location.origin}/igm/issues/${id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Découvrez "${title}" sur Info Gazette Médicale`,
          url: shareUrl
        });
        toast.success("Contenu partagé avec succès");
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lien copié dans le presse-papier");
      }
      
      // Increment the share count in the database
      await supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'shares',
        row_id: id
      });
    } catch (error) {
      logger.error(error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Erreur lors du partage");
      }
    }
  };

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="flex gap-1 flex-wrap justify-end">
      <Button
        variant="outline"
        size={isMobile ? "sm" : "sm"}
        className={isMobile ? "h-8 px-2 py-1 text-xs flex-grow sm:flex-grow-0" : "h-7 w-7 p-0"}
        onClick={handleShare}
      >
        {isMobile ? (
          <>
            <Share2 className="h-3 w-3 mr-1" />
            <span className="text-xs">Partager</span>
          </>
        ) : (
          <Share2 className="h-3.5 w-3.5" />
        )}
      </Button>
      <Button
        variant="outline"
        size={isMobile ? "sm" : "sm"}
        className={isMobile ? "h-8 px-2 py-1 text-xs flex-grow sm:flex-grow-0" : "h-7 w-7 p-0"}
        onClick={handleOpenPdf}
        disabled={!pdfUrl}
      >
        {isMobile ? (
          <>
            <ExternalLink className="h-3 w-3 mr-1" />
            <span className="text-xs">Ouvrir</span>
          </>
        ) : (
          <ExternalLink className="h-3.5 w-3.5" />
        )}
      </Button>
      <Button
        variant="outline"
        size={isMobile ? "sm" : "sm"}
        className={isMobile ? "h-8 px-2 py-1 text-xs flex-grow sm:flex-grow-0" : "h-7 w-7 p-0"}
        onClick={handleDownload}
        disabled={!pdfUrl || isDownloading}
      >
        {isMobile ? (
          <>
            <Download className={`h-3 w-3 mr-1 ${isDownloading ? 'animate-pulse' : ''}`} />
            <span className="text-xs">PDF</span>
          </>
        ) : (
          <Download className={`h-3.5 w-3.5 ${isDownloading ? 'animate-pulse' : ''}`} />
        )}
      </Button>
    </div>
  );
};
