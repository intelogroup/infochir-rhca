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
import { motion } from "framer-motion";

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

        <div className="px-6 py-4 border-y bg-gray-50/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AtlasModalMetadata chapter={chapter} />
            <div className="mt-4">
              <AtlasModalStats stats={chapter.stats} />
            </div>
          </motion.div>
        </div>

        <ScrollArea className="flex-1 h-[calc(100%-280px)]">
          <div className="px-4 sm:px-6">
            <div className="space-y-8 py-6">
              <AtlasModalContent chapter={chapter} />
            </div>
          </div>
        </ScrollArea>

        <AtlasModalActions onShare={handleShare} onDownload={handleDownload} />
      </DialogContent>
    </Dialog>
  );
};