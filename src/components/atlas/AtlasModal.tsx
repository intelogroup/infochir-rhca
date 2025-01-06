import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User, Tag } from "lucide-react";
import { AtlasModalProps } from "./types";
import { toast } from "sonner";
import { AtlasModalHeader } from "./modal/AtlasModalHeader";
import { AtlasModalStats } from "./modal/AtlasModalStats";
import { AtlasModalActions } from "./modal/AtlasModalActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export const AtlasModal = ({ chapter, open, onOpenChange }: AtlasModalProps) => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);

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
      <DialogContent className={`${isMobile ? 'w-full h-full max-w-none m-0 rounded-none' : 'max-w-5xl h-[90vh]'} p-0`}>
        <DialogDescription className="sr-only">
          Détails du chapitre {chapter.title}
        </DialogDescription>
        
        <div className="relative">
          {!imageLoaded && chapter.coverImage && (
            <Skeleton className="w-full h-[200px]" />
          )}
          <AtlasModalHeader 
            title={chapter.title} 
            coverImage={chapter.coverImage}
            onImageLoad={() => setImageLoaded(true)}
          />
        </div>

        <ScrollArea className={`${isMobile ? 'h-[calc(100vh-200px)]' : 'h-[calc(90vh-200px)]'} px-4 sm:px-8`}>
          <div className="space-y-6 py-6">
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              {chapter.lastUpdate && (
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>MàJ: {chapter.lastUpdate}</span>
                </div>
              )}
              {chapter.author && (
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4" />
                  <span>{chapter.author}</span>
                </div>
              )}
              {chapter.status === "coming" && (
                <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full">
                  <Tag className="h-4 w-4" />
                  <span>À venir</span>
                </div>
              )}
            </div>

            {chapter.description && (
              <div className="prose prose-sm sm:prose-base max-w-none">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  À propos de ce chapitre
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {chapter.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Statistiques
              </h3>
              <AtlasModalStats stats={chapter.stats} />
            </div>

            <div className="pt-4">
              <AtlasModalActions onShare={handleShare} onDownload={handleDownload} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};