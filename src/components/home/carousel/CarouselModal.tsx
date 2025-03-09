
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { createLogger } from "@/lib/error-logger";
import { formatDate } from "@/lib/utils";
import { CarouselItem } from "./types";
import { useEffect, useRef } from "react";

const logger = createLogger('CarouselModal');

interface CarouselModalProps {
  item: CarouselItem;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const CarouselModal = ({ 
  item, 
  isOpen, 
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}: CarouselModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleClose = () => {
    logger.debug(`Closing modal for: ${item.title}`);
    onClose();
  };

  // Handle keyboard navigation within the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (hasPrevious && onPrevious) {
          e.preventDefault();
          onPrevious();
        }
        break;
      case 'ArrowRight':
        if (hasNext && onNext) {
          e.preventDefault();
          onNext();
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  };

  // Focus on close button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen, item]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl" 
        onKeyDown={handleKeyDown}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-blue-800" id="modal-title">
              {item.title}
            </DialogTitle>
            <Button 
              ref={closeButtonRef}
              variant="ghost" 
              className="h-8 w-8 p-0" 
              onClick={handleClose}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription id="modal-description">
            {item.category && (
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mr-2">
                {item.category}
              </span>
            )}
            {item.date && <span className="text-gray-500 text-sm">{formatDate(item.date)}</span>}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col space-y-4">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-gray-100">
              <ImageOptimizer
                src={item.image}
                alt={item.title}
                width={600}
                height={450}
                className="w-full h-full object-cover"
                priority={true}
              />
            </div>
            
            {item.author && (
              <p className="text-sm text-gray-600 font-medium">
                Par {item.author}
              </p>
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {item.description}
              </p>
            </div>
            
            <div className="mt-auto pt-4">
              <Button
                className="w-full sm:w-auto"
                onClick={() => window.open(item.link, '_blank')}
                aria-label={`Read full article: ${item.title}`}
              >
                Lire l'article complet
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {hasPrevious && (
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="flex items-center gap-1"
                aria-label="Previous article"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            Fermer
          </Button>
          
          <div className="flex gap-2">
            {hasNext && (
              <Button
                variant="outline"
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-1"
                aria-label="Next article"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogFooter>

        {/* Keyboard navigation instructions */}
        <div className="sr-only">
          Use left and right arrow keys to navigate between articles.
          Press Escape to close the dialog.
        </div>
      </DialogContent>
    </Dialog>
  );
};
