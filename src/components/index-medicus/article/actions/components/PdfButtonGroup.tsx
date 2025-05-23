
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2 } from "lucide-react";

interface PdfButtonGroupProps {
  isLoading: boolean;
  handleDownloadPdf: (e: React.MouseEvent) => Promise<void>;
  handleOpenPdf: (e: React.MouseEvent) => void;
}

export const PdfButtonGroup: React.FC<PdfButtonGroupProps> = ({
  isLoading,
  handleDownloadPdf,
  handleOpenPdf
}) => {
  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        className="gap-1 px-2 py-1 h-8"
        onClick={handleOpenPdf}
        disabled={isLoading}
      >
        <ExternalLink className="h-3 w-3" />
        <span className="text-xs">Ouvrir</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1 px-2 py-1 h-8"
        onClick={handleDownloadPdf}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Download className="h-3 w-3" />
        )}
        <span className="text-xs">Télécharger</span>
      </Button>
    </div>
  );
};
