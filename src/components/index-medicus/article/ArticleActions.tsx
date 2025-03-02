
import React, { useEffect, useState } from "react";
import { Download, Share2, Quote, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "../types";

export interface ArticleActionsProps {
  title?: string;
  pdfUrl?: string;
  hideDownload?: boolean;
  showViewButton?: boolean;
  article?: Article;
  onCitation?: (format: "APA" | "MLA" | "Chicago" | "Harvard") => void;
  onShare?: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({
  title = "",
  pdfUrl,
  hideDownload = false,
  showViewButton = false,
  article,
  onCitation = () => {},
  onShare = () => {},
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
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
        if (pdfUrl.includes('article-pdfs') || pdfUrl.includes('rhca-pdfs')) {
          const bucketName = pdfUrl.includes('article-pdfs') ? 'article-pdfs' : 'rhca-pdfs';
          const fileName = pdfUrl.split('/').pop();
          if (!fileName) {
            setFileExists(false);
            return;
          }

          const { data, error } = await supabase
            .storage
            .from(bucketName)
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

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }
    
    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
      return;
    }
    
    window.open(pdfUrl, '_blank');
    toast.success("PDF ouvert dans un nouvel onglet");
  };
  
  const handleDownloadPdf = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }
    
    if (fileExists === false) {
      toast.error("Le fichier PDF n'existe pas dans notre stockage");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For Supabase storage URLs
      if (pdfUrl.includes('article-pdfs') || pdfUrl.includes('rhca-pdfs')) {
        const bucketName = pdfUrl.includes('article-pdfs') ? 'article-pdfs' : 'rhca-pdfs';
        const fileName = pdfUrl.split('/').pop();
        
        if (!fileName) {
          throw new Error("Invalid file name");
        }
        
        // Get a signed URL or public URL
        const { data: urlData, error: urlError } = await supabase
          .storage
          .from(bucketName)
          .createSignedUrl(fileName, 60);
        
        if (urlError || !urlData) {
          throw urlError || new Error("Failed to get URL");
        }
        
        // Fetch the file using the signed URL
        const response = await fetch(urlData.signedUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        // Create URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast.success("Téléchargement réussi");
      } else {
        // External URL - direct download
        // Create an invisible link to download the file
        const fileName = title ? `${title.slice(0, 30)}.pdf` : 'article.pdf';
        const response = await fetch(pdfUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success("Téléchargement réussi");
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setIsLoading(false);
    }
  };

  // Display PDF verification state
  const renderPdfButton = () => {
    if (hideDownload) {
      return null;
    }
    
    if (fileExists === null && pdfUrl) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Vérification...</span>
        </Button>
      );
    }
    
    if (!pdfUrl || fileExists === false) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 opacity-60"
          disabled
        >
          <AlertCircle className="h-4 w-4" />
          <span>PDF indisponible</span>
        </Button>
      );
    }
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            PDF
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
    );
  };

  // Add a view button for article details
  const renderViewButton = () => {
    if (!showViewButton || !article) {
      return null;
    }
    
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => window.location.href = `/articles/${article.id}`}
      >
        <ExternalLink className="h-4 w-4" />
        Voir
      </Button>
    );
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
        Partager
      </Button>

      {renderPdfButton()}
      {renderViewButton()}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Quote className="h-4 w-4" />
            Citer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onCitation("APA")}>
            Format APA
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCitation("MLA")}>
            Format MLA
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCitation("Chicago")}>
            Format Chicago
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCitation("Harvard")}>
            Format Harvard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
