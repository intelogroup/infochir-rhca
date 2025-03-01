
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableActionsProps {
  articleId: string;
  pdfUrl?: string;
}

export const TableActions = ({ articleId, pdfUrl }: TableActionsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/index-medicus/articles/${articleId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleOpenPdf = async () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }

    setIsDownloading(true);
    try {
      let finalUrl = pdfUrl;
      
      if (pdfUrl.includes('article-pdfs')) {
        const { data: signedUrl, error } = await supabase
          .storage
          .from('article-pdfs')
          .createSignedUrl(pdfUrl, 60);

        if (error) throw error;
        finalUrl = signedUrl.signedUrl;
      }
      
      window.open(finalUrl, '_blank');
      toast.success("Ouverture du PDF...");
    } catch (error) {
      console.error('PDF open error:', error);
      toast.error("Erreur lors de l'ouverture du PDF");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }

    setIsDownloading(true);
    try {
      let fileUrl = pdfUrl;
      
      if (pdfUrl.includes('article-pdfs')) {
        const { data: signedUrl, error } = await supabase
          .storage
          .from('article-pdfs')
          .createSignedUrl(pdfUrl, 60);

        if (error) throw error;
        fileUrl = signedUrl.signedUrl;
      }
      
      // Create an invisible link to download the file
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `article-${articleId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="hover:bg-muted"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-muted"
            disabled={isDownloading || !pdfUrl}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpenPdf}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir dans un nouvel onglet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(`/index-medicus/articles/${articleId}`, '_blank')}
        className="hover:bg-muted"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};
