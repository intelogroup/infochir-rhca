import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";

interface AtlasModalActionsProps {
  onShare: () => void;
  onDownload: () => void;
}

export const AtlasModalActions = ({ onShare, onDownload }: AtlasModalActionsProps) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-6 bg-background/95 backdrop-blur-sm border-t">
      <div className="flex gap-3 max-w-3xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 text-ocean hover:bg-ocean hover:text-white border-ocean transition-colors"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 text-ocean hover:bg-ocean hover:text-white border-ocean transition-colors"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
          Télécharger le PDF
        </Button>
      </div>
    </div>
  );
};