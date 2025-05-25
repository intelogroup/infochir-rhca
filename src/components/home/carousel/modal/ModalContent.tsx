
import { X, Calendar, Users, Download, ArrowRight, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CardHeader } from "../content/CardHeader";
import { CarouselItem } from "../types";
import { toast } from "sonner";

interface ModalContentProps {
  highlight: CarouselItem;
  articleDetails: any;
  isLoading: boolean;
  onClose: () => void;
  renderContent: () => React.ReactNode;
}

export const ModalContent = ({ 
  highlight, 
  articleDetails, 
  isLoading, 
  onClose,
  renderContent 
}: ModalContentProps) => {
  const handleViewArticle = () => {
    if (highlight.link) {
      window.open(highlight.link, '_blank');
    } else {
      toast.error("Article non disponible");
    }
  };

  const handleOpenPdf = () => {
    if (!highlight.pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(highlight.pdfUrl, '_blank');
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="default"
        className="absolute right-0 top-0 z-10"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader 
        image={highlight.image}
        title={highlight.title}
        category={highlight.category}
        isModal
      />

      <ScrollArea className="max-h-[calc(90vh-250px)] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 break-words">
              {highlight.title}
            </h2>
            
            {/* Article abstract */}
            {highlight.abstract && (
              <div className="prose prose-sm max-w-none mb-4">
                <h4 className="font-semibold mb-2 text-gray-800">Résumé</h4>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {highlight.abstract}
                </p>
              </div>
            )}
            
            {/* Fallback to description if no abstract */}
            {!highlight.abstract && highlight.description && (
              <p className="text-gray-600 whitespace-pre-line break-words">
                {highlight.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 border-y border-gray-100 py-4">
            {highlight.date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{highlight.date}</span>
              </span>
            )}
            {highlight.author && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{highlight.author}</span>
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {articleDetails && (
                <>
                  {articleDetails.tags && articleDetails.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {articleDetails.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-secondary/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {articleDetails.abstract && (
                    <div className="prose prose-sm max-w-none break-words">
                      <h4 className="font-semibold mb-2">Résumé</h4>
                      <p className="text-gray-600 whitespace-pre-line">{articleDetails.abstract}</p>
                    </div>
                  )}
                  
                  {articleDetails.institution && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Institution</h4>
                      <p className="text-gray-600 break-words">{articleDetails.institution}</p>
                    </div>
                  )}
                </>
              )}
              
              {!articleDetails && !isLoading && renderContent()}
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Bottom actions */}
      <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
        {highlight.pdfUrl && (
          <Button 
            className="gap-2"
            variant="outline"
            onClick={handleOpenPdf}
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir
          </Button>
        )}
        
        {articleDetails && articleDetails.pdf_url && (
          <Button 
            className="gap-2"
            variant="outline"
            onClick={() => window.open(articleDetails.pdf_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir PDF
          </Button>
        )}
        
        {highlight.link && (
          <Button
            className="gap-2"
            onClick={handleViewArticle}
            aria-label={`View full article: ${highlight.title}`}
          >
            <ExternalLink className="h-4 w-4" />
            Consulter l'article
          </Button>
        )}
      </div>
    </div>
  );
};
