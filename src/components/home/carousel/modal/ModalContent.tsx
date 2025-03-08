
import { X, Calendar, Users, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CardHeader } from "../content/CardHeader";
import type { Highlight } from "../carouselData";

interface ModalContentProps {
  highlight: Highlight;
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
            
            <p className="text-gray-600 whitespace-pre-line break-words">
              {highlight.description}
            </p>
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
                  
                  <div className="prose prose-sm max-w-none break-words">
                    <p className="text-gray-600 whitespace-pre-line">{articleDetails.abstract}</p>
                  </div>
                  
                  {articleDetails.authors && articleDetails.authors.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Auteurs</h4>
                      <p className="text-gray-600 break-words">{Array.isArray(articleDetails.authors) ? articleDetails.authors.join(", ") : articleDetails.authors}</p>
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
      
      {articleDetails && articleDetails.pdf_url && (
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button 
            className="gap-2"
            variant="default"
            onClick={() => window.open(articleDetails.pdf_url, '_blank')}
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </div>
      )}
      
      {highlight.link && (
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button 
            className="gap-2"
            variant="default"
            onClick={() => window.open(highlight.link, '_blank')}
          >
            Voir plus
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
