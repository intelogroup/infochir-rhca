
import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Highlight } from "./carouselData";
import { EventContent } from "./content/EventContent";
import { TrainingContent } from "./content/TrainingContent";
import { ArticleContent } from "./content/ArticleContent";
import { CardHeader } from "./content/CardHeader";
import { CardFooter } from "./content/CardFooter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModalContent } from "./modal/ModalContent";
import { queryKeys } from "@/lib/react-query";

interface CarouselCardProps {
  highlight: Highlight;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch full article data when modal is opened
  const { data: articleDetails, isLoading } = useQuery({
    queryKey: highlight.id ? queryKeys.articles.detail(highlight.id) : ['highlight', highlight.title],
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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
          
          <div className="p-4 sm:p-6 flex-grow flex flex-col h-[200px]">
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
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
          <ModalContent
            highlight={highlight}
            articleDetails={articleDetails}
            isLoading={isLoading}
            onClose={() => setIsOpen(false)}
            renderContent={renderContent}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
