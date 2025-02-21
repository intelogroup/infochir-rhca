
import { useState } from "react";
import { Share2, Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IssueCardActionsProps {
  pdfUrl?: string;
  id: string;
  onViewDetails: () => void;
}

export const IssueCardActions = ({ pdfUrl, id, onViewDetails }: IssueCardActionsProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);
    try {
      const shareUrl = `${window.location.origin}/igm/issues/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié dans le presse-papier", {
        className: "bg-secondary text-white",
      });
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    
    setIsDownloading(true);
    try {
      window.open(pdfUrl, '_blank');
      toast.success("Ouverture du PDF...", {
        className: "bg-secondary text-white",
      });
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <div className="flex gap-1.5 flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary transition-colors relative"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Partager</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost"
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary transition-colors"
              onClick={handleDownload}
              disabled={!pdfUrl || isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Télécharger PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voir les détails</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
