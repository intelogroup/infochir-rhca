import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";

interface AtlasModalActionsProps {
  onShare: () => void;
  onDownload: () => void;
}

export const AtlasModalActions = ({ onShare, onDownload }: AtlasModalActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 hover:bg-primary hover:text-white transition-colors"
        onClick={onShare}
      >
        <Share2 className="h-5 w-5 mr-2" />
        Partager
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="flex-1 hover:bg-primary hover:text-white transition-colors"
        onClick={onDownload}
      >
        <Download className="h-5 w-5 mr-2" />
        Télécharger le PDF
      </Button>
    </div>
  );
};