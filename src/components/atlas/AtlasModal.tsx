import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";
import { AtlasModalProps } from "./types";
import { toast } from "sonner";
import { AtlasModalHeader } from "./modal/AtlasModalHeader";
import { AtlasModalStats } from "./modal/AtlasModalStats";
import { AtlasModalActions } from "./modal/AtlasModalActions";
import { AtlasModalMetadata } from "./modal/AtlasModalMetadata";
import { AtlasModalContent } from "./modal/AtlasModalContent";
import { useIsMobile } from "@/hooks/use-mobile";

export const AtlasModal = ({ chapter, open, onOpenChange }: AtlasModalProps) => {
  const isMobile = useIsMobile();

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/adc/chapters/${chapter.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    toast.error("Le téléchargement n'est pas encore disponible");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${
        isMobile ? 'w-[95%] h-[85vh] mx-auto rounded-lg' : 
        'w-[90%] max-w-3xl h-[80vh]'
      } p-0 overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-100 shadow-lg`}>
        <DialogDescription className="sr-only">
          Détails du chapitre {chapter.title}
        </DialogDescription>
        
        <AtlasModalHeader 
          title={chapter.title} 
          coverImage={chapter.coverImage}
        />

        <ScrollArea className="flex-1 h-[calc(100%-280px)]">
          <div className="px-4 sm:px-6">
            <div className="space-y-8 py-6">
              <AtlasModalMetadata chapter={chapter} />
              <AtlasModalContent chapter={chapter} />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Statistiques</h3>
                </div>
                <AtlasModalStats stats={chapter.stats} />
              </div>
            </div>
          </div>
        </ScrollArea>

        <AtlasModalActions onShare={handleShare} onDownload={handleDownload} />
      </DialogContent>
    </Dialog>
  );
};