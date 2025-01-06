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
      className="w-full space-y-4 overflow-visible"
      role="feed"
      aria-label="Liste des articles"
    >
      {articles.map((article) => (
        <div 
          key={article.id}
          className="relative bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
          role="article"
          aria-labelledby={`article-title-${article.id}`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
            <div className="flex-1 min-w-0 space-y-3">
              <h3 
                id={`article-title-${article.id}`}
                className="text-xl font-semibold text-gray-900 line-clamp-2"
              >
                {article.title}
              </h3>
              <p 
                className="text-base text-gray-600"
                aria-label={`Auteurs: ${article.authors.join(", ")}`}
              >
                {article.authors.join(", ")}
              </p>
              <div className="flex flex-col gap-3">
                <div 
                  className="flex flex-wrap items-center gap-2 sm:gap-4"
                  aria-label="Informations de publication"
                >
                  <span className="text-sm text-gray-500">
                    Page {article.pageNumber}
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(article.date), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                  {article.views && (
                    <>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span 
                        className="text-sm text-gray-500"
                        aria-label={`${article.views} vues`}
                      >
                        {article.views} vues
                      </span>
                    </>
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
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/5 text-primary"
                        role="listitem"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto self-end">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 lg:flex-none gap-2 bg-white hover:bg-gray-50"
                onClick={() => handleShare(article.id)}
                aria-label="Partager l'article"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                <span>Partager</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 lg:flex-none gap-2 bg-white hover:bg-gray-50"
                onClick={() => handleDownload(article.pdfUrl)}
                aria-label={article.pdfUrl ? "Télécharger le PDF" : "PDF non disponible"}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>PDF</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};