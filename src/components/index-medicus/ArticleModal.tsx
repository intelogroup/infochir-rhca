
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Article } from "./types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, User, BookOpen, Building, 
  FileText, Download, Quote, Eye, ExternalLink 
} from "lucide-react";
import { PdfActions } from "./article/actions/PdfActions";
import { ShareAction } from "./article/actions/ShareAction";
import { Button } from "@/components/ui/button";
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

  // Determine the type of publication for display
  const getPublicationType = (article: Article) => {
    if (article.source === 'INDEX' && article.category?.toLowerCase().includes('article')) {
      return 'Article';
    }
    return 'Journal';
  };

  // Format publication information
  const getPublicationInfo = (article: Article) => {
    const parts = [];
    
    if (article.source) {
      parts.push(article.source);
    }
    
    if (article.volume && article.issue) {
      parts.push(`Volume ${article.volume}, Issue ${article.issue}`);
    } else if (article.volume) {
      parts.push(`Volume ${article.volume}`);
    } else if (article.issue) {
      parts.push(`Issue ${article.issue}`);
    }
    
    if (article.pageNumber) {
      parts.push(`Page ${article.pageNumber}`);
    }
    
    return parts.join('\n');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-white flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900 line-clamp-3">
              {article.title}
            </DialogTitle>
            <DialogDescription className="text-primary/80 font-medium text-sm sm:text-base">
              Publié le {formattedDate}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-4 sm:px-6 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          
          <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="default" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium"
              >
                {getPublicationType(article)}
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-secondary/10 text-secondary border-secondary/20 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium"
              >
                {article.source}
              </Badge>
            </div>

            {/* Publication Information - replaces where tags used to be */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="text-sm text-gray-700 whitespace-pre-line font-medium">
                {getPublicationInfo(article)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm text-gray-600">
              {article.authors && article.authors.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/60 flex-shrink-0" />
                  <span className="break-words">{article.authors.join(", ")}</span>
                </div>
              )}
              
              {article.institution && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary/60 flex-shrink-0" />
                  <span className="break-words">{article.institution}</span>
                </div>
              )}
              
              {article.volume && article.issue && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary/60 flex-shrink-0" />
                  <span>Volume {article.volume}, Issue {article.issue}</span>
                </div>
              )}
              
              {article.pageNumber && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary/60 flex-shrink-0" />
                  <span>Page {article.pageNumber}</span>
                </div>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Résumé</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {article.abstract || "Aucun résumé disponible pour cet article."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-8 text-xs sm:text-sm border-t border-b py-3 sm:py-4 text-gray-600">
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

            {/* Specialty and Tags section - combined */}
            {(article.specialty || (article.tags && article.tags.length > 0)) && (
              <div className="border-t pt-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                  {article.specialty && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Spécialité</h4>
                      <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                        {article.specialty}
                      </Badge>
                    </div>
                  )}
                  
                  {article.tags && article.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Mots-clés</h4>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="bg-gray-50 text-gray-600 border-gray-200 px-2 py-0.5 text-xs font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        
        <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 shadow-sm flex-shrink-0">
          <ShareAction 
            articleId={article.id} 
            articleTitle={article.title}
          />
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleOpenPdf}
            disabled={!article.pdfUrl}
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir
          </Button>
          
          <PdfActions 
            article={article}
            pdfUrl={article.pdfUrl}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
