
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, User, BookOpen, Building, 
  FileText, Download, Quote, Eye, ExternalLink 
} from "lucide-react";
import { CardActions } from "../card/CardActions";
import { toast } from "sonner";
import type { RhcaArticle } from "../types";

interface RhcaArticleModalProps {
  article: RhcaArticle;
  open: boolean;
  onClose: () => void;
  pdfUrl?: string | null;
}

export const RhcaArticleModal: React.FC<RhcaArticleModalProps> = ({
  article,
  open,
  onClose,
  pdfUrl
}) => {
  const formattedDate = article.publicationDate 
    ? format(new Date(article.publicationDate), "PPP", { locale: fr })
    : "Date non disponible";

  const handleOpenPdf = () => {
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(pdfUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-white flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 sm:p-6 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{article.title}</h2>
          <p className="text-primary/80 font-medium text-sm sm:text-base">
            Publié le {formattedDate}
          </p>
        </div>

        <ScrollArea className="flex-1 px-3 sm:px-6 overflow-y-auto">
          <div className="py-3 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-wrap gap-2">
              {article.tags && article.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="default" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-xs sm:text-sm text-gray-600">
              {article.authors && article.authors.length > 0 && (
                <div className="flex items-start gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{article.authors.join(", ")}</span>
                </div>
              )}
              
              {article.institution && (
                <div className="flex items-start gap-2">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{article.institution}</span>
                </div>
              )}
              
              {article.volume && article.issue && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0" />
                  <span>Volume {article.volume}, Issue {article.issue}</span>
                </div>
              )}
              
              {article.pageNumber && (
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0" />
                  <span>Page {article.pageNumber}</span>
                </div>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Résumé</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base break-words">
                {article.abstract || "Aucun résumé disponible pour cet article."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-8 text-xs sm:text-sm border-t border-b py-3 sm:py-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60" />
                <span>{article.views || 0} vues</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Quote className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60" />
                <span>{article.citations || 0} citations</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60" />
                <span>{article.downloads || 0} téléchargements</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60" />
                <span className="hidden sm:inline">{formattedDate}</span>
                <span className="sm:hidden">{article.publicationDate ? new Date(article.publicationDate).getFullYear() : "N/A"}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Actions</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 sm:h-9 gap-2 text-sm"
                  onClick={handleOpenPdf}
                  disabled={!pdfUrl}
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir
                </Button>
                
                <CardActions article={article} pdfUrl={pdfUrl} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
