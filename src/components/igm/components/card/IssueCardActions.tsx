
import { useState } from "react";
import { Share2, Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
      toast.success("Lien copié dans le presse-papier");
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
      // Simple direct download from storage
      const { data, error } = await supabase
        .storage
        .from('igm-pdfs')
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
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setIsDownloading(false);
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
