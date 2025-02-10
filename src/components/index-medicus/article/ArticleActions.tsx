
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ArticleActionsProps {
  title: string;
  pdfUrl?: string;
  onCitation: (format: 'APA' | 'MLA' | 'Chicago' | 'Harvard') => void;
  onShare: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({ title, pdfUrl, onCitation, onShare }) => {
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Le téléchargement va commencer...");
    } else {
      toast.error("Le PDF n'est pas disponible pour cet article");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Télécharger PDF
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copier la citation
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onCitation('APA')}>
            Format APA
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCitation('MLA')}>
            Format MLA
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCitation('Chicago')}>
            Format Chicago
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCitation('Harvard')}>
            Format Harvard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
        Partager
      </Button>
    </div>
  );
};

