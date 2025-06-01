
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
  const [isSharing, setIsSharing] = React.useState(false);
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
      setIsSharing(true);
      
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
    } finally {
      setIsSharing(false);
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
    <div className="flex items-center gap-0.5">
      <Button
        variant="outline"
        size="sm"
        className="bg-blue-50 px-1 py-0.5 rounded text-blue-700 hover:bg-blue-100 transition-all duration-200 text-[8px] font-medium h-4"
        onClick={handleShare}
        disabled={isSharing}
      >
        <Share2 className="mr-0.5 h-2 w-2" />
        Partager
      </Button>
      
      {pdfUrl && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-50 px-1 py-0.5 rounded text-green-700 hover:bg-green-100 transition-all duration-200 text-[8px] font-medium h-4"
            onClick={handleOpenPdf}
          >
            <ExternalLink className="mr-0.5 h-2 w-2" />
            Ouvrir
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-amber-50 px-1 py-0.5 rounded text-amber-700 hover:bg-amber-100 transition-all duration-200 text-[8px] font-medium h-4"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="mr-0.5 h-2 w-2" />
            PDF
          </Button>
        </>
      )}
    </div>
  );
};
