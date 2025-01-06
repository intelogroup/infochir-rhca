import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
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

  return (
    <div className="flex gap-3 w-full sm:w-auto">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none gap-2 bg-white hover:bg-gray-50"
        onClick={handleShare}
        aria-label="Partager l'article"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span className="whitespace-nowrap">Partager</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none gap-2 bg-white hover:bg-gray-50"
        onClick={handleDownload}
        aria-label={pdfUrl ? "Télécharger le PDF" : "PDF non disponible"}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span className="whitespace-nowrap">PDF</span>
      </Button>
    </div>
  );
};