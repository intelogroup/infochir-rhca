
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createLogger } from "@/lib/error-logger";
import { formatDate } from "@/lib/utils";
import { CarouselItem } from "./types";
import { useEffect, useRef } from "react";

const logger = createLogger('CarouselModal');

interface CarouselModalProps {
  item: CarouselItem;
  isOpen: boolean;
  onClose: () => void;
}

export const CarouselModal = ({ 
  item, 
  isOpen, 
  onClose
}: CarouselModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Focus on close button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen, item]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-lg md:max-w-2xl p-0 overflow-hidden"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-xl font-bold text-primary" id="modal-title">
            {item.title}
          </DialogTitle>
          <Button 
            ref={closeButtonRef}
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="p-4">
            <DialogDescription id="modal-description" className="mb-4">
              {item.category && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mr-2">
                  {item.category}
                </span>
              )}
              {item.date && <span className="text-gray-500 text-sm">{formatDate(item.date)}</span>}
              {item.author && (
                <div className="mt-2 text-sm text-gray-600 font-medium">
                  Par {item.author}
                </div>
              )}
            </DialogDescription>
            
            <div className="relative rounded-lg overflow-hidden aspect-video mb-4 bg-gray-100">
              <ImageOptimizer
                src={item.image}
                alt={item.title}
                width={600}
                height={340}
                className="w-full h-full object-cover"
                priority={true}
              />
            </div>
            
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-4 border-t bg-gray-50">
          <Button
            className="flex items-center gap-2"
            onClick={() => window.open(item.link, '_blank')}
            aria-label={`Read full article: ${item.title}`}
          >
            <ExternalLink className="h-4 w-4" />
            Consulter l'article
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
