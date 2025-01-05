import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaArticle } from "./types";

interface RhcaCardProps {
  article: RhcaArticle;
}

export const RhcaCard = ({ article }: RhcaCardProps) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/rhca/articles/${article.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    if (!article.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(article.pdfUrl, '_blank');
    toast.success("Ouverture du PDF...");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {article.title}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {article.authors.join(", ")}
            </p>
            <div className="flex items-center gap-4 mt-2">
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
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {article.abstract}
        </p>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/5 text-primary text-sm rounded-full"
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