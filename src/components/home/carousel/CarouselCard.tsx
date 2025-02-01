import { useState } from "react";
import { X, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Highlight } from "./carouselData";
import { EventContent } from "./content/EventContent";
import { TrainingContent } from "./content/TrainingContent";
import { ArticleContent } from "./content/ArticleContent";
import { CardHeader } from "./content/CardHeader";
import { CardFooter } from "./content/CardFooter";

interface CarouselCardProps {
  highlight: Highlight;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="p-2 h-full"
      >
        <div 
          className="relative group h-full rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <CardHeader 
            image={highlight.image}
            title={highlight.title}
            category={highlight.category}
          />
          
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {highlight.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {highlight.description}
            </p>
            
            <CardFooter 
              date={highlight.date}
              author={highlight.author}
            />
          </div>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
          <div className="relative">
            <Button
              variant="ghost"
              size="default"
              className="absolute right-0 top-0 z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="space-y-6">
              <CardHeader 
                image={highlight.image}
                title={highlight.title}
                category={highlight.category}
              />

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
                    <Calendar className="h-4 w-4" />
                    {highlight.date}
                  </span>
                )}
                {highlight.author && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {highlight.author}
                  </span>
                )}
              </div>

              {renderContent()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};