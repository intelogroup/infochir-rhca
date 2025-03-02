
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour ce numéro");
      return;
    }
    
    try {
      // Increment the download count in the database
      await supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'downloads',
        row_id: id
      });
      
      // Open the PDF in a new tab
      window.open(pdfUrl, '_blank');
      toast.success("Téléchargement du PDF en cours...");
    } catch (error) {
      console.error("Error incrementing download count:", error);
      // Still open the PDF even if the count update fails
      window.open(pdfUrl, '_blank');
      toast.success("Téléchargement du PDF en cours...");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
      console.error("Error sharing:", error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Erreur lors du partage");
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={handleShare}
      >
        <Share2 className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={handleDownload}
        disabled={!pdfUrl}
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
