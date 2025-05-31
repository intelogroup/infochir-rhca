
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Article } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, User, BookOpen, Building, 
  FileText, Download, Quote, Eye, ExternalLink 
} from "lucide-react";
import { PdfActions } from "./actions/PdfActions";
import { ShareAction } from "./actions/ShareAction";
import { toast } from "sonner";

interface ArticleModalProps {
  article: Article;
  open: boolean;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  open,
  onClose,
}) => {
  const formattedDate = format(new Date(article.publicationDate), "PPP", { locale: fr });

  const handleOpenPdf = () => {
    if (!article.pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(article.pdfUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-white flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 sm:p-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 line-clamp-2 leading-tight">
              {article.title}
            </DialogTitle>
            <DialogDescription className="text-primary/80 font-medium text-sm sm:text-base mt-1">
              Publié le {formattedDate}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-3 sm:px-6 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="py-3 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-gray-600">
              {article.authors && article.authors.length > 0 && (
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0 mt-0.5" />
                  <span className="break-words text-xs sm:text-sm">{article.authors.join(", ")}</span>
                </div>
              )}
              
              {article.institution && (
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0 mt-0.5" />
                  <span className="break-words text-xs sm:text-sm">{article.institution}</span>
                </div>
              )}
              
              {article.volume && article.issue && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Volume {article.volume}, Issue {article.issue}</span>
                </div>
              )}
              
              {article.pageNumber && (
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Page {article.pageNumber}</span>
                </div>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Résumé</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
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
                <span className="sm:hidden">{new Date(article.publicationDate).getFullYear()}</span>
              </div>
            </div>

            {article.specialty && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Spécialité</h4>
                <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 text-xs sm:text-sm">
                  {article.specialty}
                </Badge>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 shadow-sm flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <ShareAction 
              articleId={article.id} 
              articleTitle={article.title}
            />
            
            <Button
              variant="outline"
              size="sm"
              className="h-10 sm:h-9 px-4 font-medium hover:bg-gray-50 transition-colors duration-200 text-sm"
              onClick={handleOpenPdf}
              disabled={!article.pdfUrl}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir
            </Button>
            
            <PdfActions 
              article={article}
              pdfUrl={article.pdfUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
