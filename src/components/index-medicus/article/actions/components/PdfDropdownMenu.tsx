
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface PdfDropdownMenuProps {
  isLoading: boolean;
  handleDownloadPdf: (e: React.MouseEvent) => Promise<void>;
  handleOpenPdf: (e: React.MouseEvent) => void;
}

export const PdfDropdownMenu: React.FC<PdfDropdownMenuProps> = ({
  isLoading,
  handleDownloadPdf,
  handleOpenPdf
}) => {
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
          <span>PDF</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleOpenPdf}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Ouvrir PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPdf}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
