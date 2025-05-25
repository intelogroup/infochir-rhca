
import { Button } from "@/components/ui/button";
import { Download, Share2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import type { Issue } from "../../types";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('IssueModalActions');

interface IssueModalActionsProps {
  issue: Issue;
}

export const IssueModalActions = ({ issue }: IssueModalActionsProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    const shareUrl = `${window.location.origin}/igm/issues/${issue.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      const currentShares = issue.shares || issue.shareCount || 0;
      
      const { error } = await supabase
        .from('articles')
        .update({ shares: currentShares + 1 })
        .eq('id', issue.id);

      if (error) throw error;
      
      toast.success("Lien copié dans le presse-papier", {
        className: "bg-secondary text-white",
      });
    } catch (error) {
      logger.error('Error sharing:', error);
      toast.error("Erreur lors du partage");
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  const handleOpenPdf = () => {
    if (!issue.pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(issue.pdfUrl, '_blank');
  };

  const handleDownload = async () => {
    if (!issue.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible pour ce numéro");
      return;
    }

    setIsDownloading(true);
    try {
      const success = await downloadPDF({
        url: issue.pdfUrl,
        fileName: `IGM_${issue.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        documentId: issue.id,
        documentType: DocumentType.IGM
      });
      
      if (success) {
        toast.success("Téléchargement du PDF en cours...", {
          className: "bg-secondary text-white",
        });
      } else {
        toast.error("Erreur lors du téléchargement");
      }
    } catch (error) {
      logger.error('Error downloading:', error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] hover:bg-secondary/10 hover:text-secondary transition-colors"
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        Partager
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] hover:bg-secondary/10 hover:text-secondary transition-colors"
        onClick={handleOpenPdf}
        disabled={!issue.pdfUrl}
      >
        <ExternalLink className="h-4 w-4" />
        Ouvrir
      </Button>
      <Button
        variant="default"
        size="sm"
        className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] bg-secondary hover:bg-secondary-light transition-colors"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Télécharger PDF
      </Button>
    </div>
  );
};
