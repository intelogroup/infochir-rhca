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
    <div className="flex gap-2 mt-auto pt-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 transition-colors"
        onClick={handleShare}
        aria-label="Partager l'article"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span className="text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)]">Partager</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 transition-colors"
        onClick={handleDownload}
        aria-label={pdfUrl ? "Télécharger le PDF" : "PDF non disponible"}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span className="text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)]">PDF</span>
      </Button>
    </div>
  );
};