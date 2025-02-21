
import React from "react";
import { Download, Share2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ArticleActionsProps {
  title: string;
  pdfUrl?: string;
  onCitation: (format: "APA" | "MLA" | "Chicago" | "Harvard") => void;
  onShare?: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({
  pdfUrl,
  onCitation,
  onShare = () => {},
}) => {
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
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          asChild
        >
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            PDF
          </a>
        </Button>
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
