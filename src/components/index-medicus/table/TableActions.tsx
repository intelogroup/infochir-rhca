
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
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
  const [fileExists, setFileExists] = useState<boolean | null>(null);

  // Check if file exists when component mounts
  useEffect(() => {
    const checkFileExists = async () => {
      if (!pdfUrl) {
        setFileExists(false);
        return;
      }

      try {
        // For URLs in Supabase storage
        if (pdfUrl.includes('article-pdfs')) {
          const fileName = pdfUrl.split('/').pop();
          if (!fileName) {
            setFileExists(false);
            return;
          }

          const { data, error } = await supabase
            .storage
            .from('article-pdfs')
            .list('', {
              search: fileName
            });

          if (error) {
            console.error('Error checking file existence:', error);
            setFileExists(false);
            return;
          }

          setFileExists(data && data.some(file => file.name === fileName));
        } else {
          // For external URLs, try a HEAD request
          const response = await fetch(pdfUrl, { method: 'HEAD' });
          setFileExists(response.ok);
        }
      } catch (err) {
        console.error('Failed to check file existence:', err);
        setFileExists(false);
      }
    };

    checkFileExists();
  }, [pdfUrl]);

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

    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
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
      
      // Increment view counter
      try {
        await supabase.rpc('increment_count', { 
          table_name: 'igm_articles_view',
          column_name: 'views',
          row_id: articleId
        });
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
      
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

    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
      return;
    }

    setIsDownloading(true);
    try {
      let fileUrl = pdfUrl;
      let fileName = pdfUrl.split('/').pop() || `article-${articleId}.pdf`;
      
      if (pdfUrl.includes('article-pdfs')) {
        // For files in Supabase storage
        const { data: signedUrl, error } = await supabase
          .storage
          .from('article-pdfs')
          .createSignedUrl(pdfUrl, 60);

        if (error) throw error;
        fileUrl = signedUrl.signedUrl;
      }
      
      // Fetch the file
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create an invisible link to download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Increment download counter
      try {
        await supabase.rpc('increment_count', { 
          table_name: 'igm_articles_view',
          column_name: 'downloads',
          row_id: articleId
        });
      } catch (error) {
        console.error('Failed to increment download count:', error);
      }
      
      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  // If we're still checking if the file exists
  if (fileExists === null && pdfUrl) {
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
        
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="hover:bg-muted"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
        
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
  }

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
      
      {(pdfUrl && fileExists) ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-muted"
              disabled={isDownloading}
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
      ) : pdfUrl ? (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="hover:bg-muted"
          title="PDF non disponible"
        >
          <AlertCircle className="h-4 w-4" />
        </Button>
      ) : null}
      
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
