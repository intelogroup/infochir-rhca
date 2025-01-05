import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaArticle } from "./types";

interface RhcaCardProps {
  article: RhcaArticle;
  onCardClick?: () => void;
}

export const RhcaCard = ({ article, onCardClick }: RhcaCardProps) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/rhca/articles/${article.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!article.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(article.pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={onCardClick}
      role="article"
      aria-labelledby={`article-title-${article.id}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle 
              id={`article-title-${article.id}`}
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              {article.title}
            </CardTitle>
            <p 
              className="text-sm text-gray-600"
              aria-label="Auteurs"
            >
              {article.authors.join(", ")}
            </p>
            <div 
              className="flex items-center gap-4 mt-2"
              aria-label="Informations de publication"
            >
              <span className="text-sm text-gray-500">
                Page {article.pageNumber}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(article.date), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleShare}
              aria-label="Partager l'article"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Partager
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownload}
              aria-label={article.pdfUrl ? "Télécharger le PDF" : "PDF non disponible"}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p 
          className="text-gray-600 mb-4"
          aria-label="Résumé de l'article"
        >
          {article.abstract}
        </p>
        {article.tags && article.tags.length > 0 && (
          <div 
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Tags de l'article"
          >
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/5 text-primary text-sm rounded-full"
                role="listitem"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};