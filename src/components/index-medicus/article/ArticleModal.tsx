
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, User, BookOpen, Building, FileText, Download, Quote, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const handleDownload = () => {
    if (article.pdfUrl) {
      window.open(article.pdfUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {article.title}
            </DialogTitle>
            <DialogDescription className="text-primary/80 font-medium">
              Publié le {formattedDate}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[calc(90vh-12rem)] px-6">
          <div className="py-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {article.authors.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/60" />
                  <span>{article.authors.join(", ")}</span>
                </div>
              )}
              
              {article.institution && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary/60" />
                  <span>{article.institution}</span>
                </div>
              )}
              
              {article.volume && article.issue && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary/60" />
                  <span>Volume {article.volume}, Issue {article.issue}</span>
                </div>
              )}
              
              {article.pageNumber && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary/60" />
                  <span>Page {article.pageNumber}</span>
                </div>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Résumé</h3>
              <p className="text-gray-600 leading-relaxed">{article.abstract}</p>
            </div>

            <div className="flex flex-wrap gap-8 text-sm border-t border-b py-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary/60" />
                <span>{article.views || 0} vues</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4 text-primary/60" />
                <span>{article.citations || 0} citations</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-primary/60" />
                <span>{article.downloads || 0} téléchargements</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/60" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {article.specialty && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Spécialité</h4>
                <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                  {article.specialty}
                </Badge>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="bg-gray-50 p-4 flex justify-end border-t">
          {article.pdfUrl && (
            <Button 
              onClick={handleDownload}
              variant="secondary"
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
