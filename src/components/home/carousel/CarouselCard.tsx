
import { useState } from "react";
import { X, Calendar, Users, Download, ArrowRight } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Highlight } from "./carouselData";
import { EventContent } from "./content/EventContent";
import { TrainingContent } from "./content/TrainingContent";
import { ArticleContent } from "./content/ArticleContent";
import { CardHeader } from "./content/CardHeader";
import { CardFooter } from "./content/CardFooter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface CarouselCardProps {
  highlight: Highlight;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch full article data when modal is opened
  const { data: articleDetails, isLoading } = useQuery({
    queryKey: ['article-detail', highlight.id],
    queryFn: async () => {
      if (!highlight.id || !isOpen) return null;
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', highlight.id)
        .single();
      
      if (error) {
        console.error('Error fetching article details:', error);
        toast.error('Erreur lors du chargement des détails de l\'article');
        return null;
      }
      
      return data;
    },
    enabled: isOpen && !!highlight.id,
  });

  const renderContent = () => {
    const category = (highlight.category || '').toLowerCase();
    
    switch (category) {
      case 'événement':
        return <EventContent date={highlight.date || ''} />;
      case 'formation':
        return <TrainingContent />;
      default:
        return <ArticleContent views={highlight.views} citations={highlight.citations} />;
    }
  };

  return (
    <>
      <Motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="p-2 h-full"
      >
        <div 
          className="relative group h-full flex flex-col rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex-shrink-0">
            <CardHeader 
              image={highlight.image}
              title={highlight.title}
              category={highlight.category}
            />
          </div>
          
          <div className="p-4 sm:p-6 flex-grow flex flex-col min-h-[180px] max-h-[240px]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {highlight.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-auto line-clamp-3 flex-grow overflow-hidden">
              {highlight.description}
            </p>
            
            <div className="mt-4 pt-2 border-t border-gray-100">
              <CardFooter 
                date={highlight.date}
                author={highlight.author}
              />
            </div>
          </div>
        </div>
      </Motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
          <div className="relative">
            <Button
              variant="ghost"
              size="default"
              className="absolute right-0 top-0 z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <CardHeader 
              image={highlight.image}
              title={highlight.title}
              category={highlight.category}
              isModal
            />

            <ScrollArea className="max-h-[calc(80vh-200px)]">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {highlight.title}
                  </h2>
                  
                  <p className="text-gray-600">
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
                        
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-600">{articleDetails.abstract}</p>
                        </div>
                        
                        {articleDetails.authors && articleDetails.authors.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Auteurs</h4>
                            <p className="text-gray-600">{Array.isArray(articleDetails.authors) ? articleDetails.authors.join(", ") : articleDetails.authors}</p>
                          </div>
                        )}
                        
                        {articleDetails.institution && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Institution</h4>
                            <p className="text-gray-600">{articleDetails.institution}</p>
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
        </DialogContent>
      </Dialog>
    </>
  );
};

