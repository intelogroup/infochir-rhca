import { Button } from "@/components/ui/button";
import { Download, Share2, Eye } from "lucide-react";
import { toast } from "sonner";

interface ArticleActionsProps {
  id: string;
  pdfUrl?: string;
  onCardClick?: () => void;
}

export const ArticleActions = ({ id, pdfUrl, onCardClick }: ArticleActionsProps) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/rhca/articles/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCardClick?.();
  };

  return (
    <div className="flex gap-2 mt-auto pt-2 md:pt-3">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 md:flex-none gap-2 h-8 text-[clamp(0.75rem,0.7rem+0.1vw,0.875rem)]"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden md:inline">Partager</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 md:flex-none gap-2 h-8 text-[clamp(0.75rem,0.7rem+0.1vw,0.875rem)]"
        onClick={handleDownload}
        disabled={!pdfUrl}
      >
        <Download className="h-4 w-4" />
        <span className="hidden md:inline">PDF</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="flex-1 md:flex-none gap-2 h-8 text-[clamp(0.75rem,0.7rem+0.1vw,0.875rem)]"
        onClick={handleView}
      >
        <Eye className="h-4 w-4" />
        <span className="hidden md:inline">Voir</span>
      </Button>
    </div>
  );
};