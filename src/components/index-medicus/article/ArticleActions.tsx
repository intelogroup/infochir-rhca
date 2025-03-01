
import React from "react";
import { Download, Share2, Quote, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface ArticleActionsProps {
  title: string;
  pdfUrl?: string;
  onCitation: (format: "APA" | "MLA" | "Chicago" | "Harvard") => void;
  onShare?: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({
  title,
  pdfUrl,
  onCitation,
  onShare = () => {},
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }
    
    window.open(pdfUrl, '_blank');
    toast.success("PDF ouvert dans un nouvel onglet");
  };
  
  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast.error("PDF non disponible");
      return;
    }
    
    setIsLoading(true);
    
    // Create an invisible link to download the file
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title ? `${title.slice(0, 30)}.pdf` : 'article.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsLoading(false);
    toast.success("Téléchargement réussi");
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

      {pdfUrl && (
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
      )}

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
