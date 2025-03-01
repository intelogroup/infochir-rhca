
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface IssueCardActionsProps {
  pdfUrl?: string;
  id: string;
}

export const IssueCardActions: React.FC<IssueCardActionsProps> = ({
  pdfUrl,
  id
}) => {
  const handleDownload = () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour ce numéro");
      return;
    }
    
    window.open(pdfUrl, '_blank');
    toast.success("Téléchargement du PDF en cours...");
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/igm/issues/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          handleShare();
        }}
      >
        <Share2 className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        disabled={!pdfUrl}
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
