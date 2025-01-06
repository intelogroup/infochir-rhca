import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface TableActionsProps {
  articleId: string;
  pdfUrl?: string;
}

export const TableActions = ({ articleId, pdfUrl }: TableActionsProps) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/index-medicus/articles/${articleId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
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
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="hover:bg-muted"
      >
        <Download className="h-4 w-4" />
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
};