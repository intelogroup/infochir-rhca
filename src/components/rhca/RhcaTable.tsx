import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaArticle } from "./types";

export const RhcaTable = ({ articles }: { articles: RhcaArticle[] }) => {
  const handleShare = (articleId: string) => {
    const shareUrl = `${window.location.origin}/rhca/articles/${articleId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = (pdfUrl?: string) => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
  };

  return (
    <div 
      className="space-y-4"
      role="feed"
      aria-label="Liste des articles"
    >
      {articles.map((article) => (
        <div 
          key={article.id}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          role="article"
          aria-labelledby={`article-title-${article.id}`}
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 
                id={`article-title-${article.id}`}
                className="text-lg font-semibold text-gray-900 mb-2"
              >
                {article.title}
              </h3>
              <p 
                className="text-sm text-gray-600 mb-4"
                aria-label="Auteurs"
              >
                {article.authors.join(", ")}
              </p>
              <div className="flex flex-col gap-2">
                <div 
                  className="flex items-center gap-4"
                  aria-label="Informations de publication"
                >
                  <span className="text-sm text-gray-500">
                    Page {article.pageNumber}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(article.date), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                  {article.views && (
                    <span 
                      className="text-sm text-gray-500"
                      aria-label={`${article.views} vues`}
                    >
                      {article.views} vues
                    </span>
                  )}
                </div>
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
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleShare(article.id)}
                aria-label="Partager l'article"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Partager
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleDownload(article.pdfUrl)}
                aria-label={article.pdfUrl ? "Télécharger le PDF" : "PDF non disponible"}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};