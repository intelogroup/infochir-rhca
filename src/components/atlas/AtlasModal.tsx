import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User, Tag, Info, Book, Eye, Share2, Download } from "lucide-react";
import { AtlasModalProps } from "./types";
import { toast } from "sonner";
import { AtlasModalHeader } from "./modal/AtlasModalHeader";
import { AtlasModalStats } from "./modal/AtlasModalStats";
import { AtlasModalActions } from "./modal/AtlasModalActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
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
          onImageLoad={() => setImageLoaded(true)}
        />

        <ScrollArea className="h-[calc(100%-200px)] px-4 sm:px-6">
          <div className="space-y-8 py-6">
            {/* Metadata Section */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {chapter.lastUpdate && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>MàJ: {chapter.lastUpdate}</span>
                  </div>
                )}
                {chapter.author && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{chapter.author}</span>
                  </div>
                )}
                {chapter.status === "coming" && (
                  <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm">
                    <Tag className="h-4 w-4" />
                    <span>À venir</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            {chapter.description && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Info className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">À propos de ce chapitre</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {chapter.description}
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* Content Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Book className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Contenu du chapitre</h3>
              </div>
              <p className="text-gray-600">
                Ce chapitre fait partie de l'Atlas de Diagnostic Chirurgical, 
                un guide complet conçu pour les professionnels de santé. 
                Il contient des informations détaillées, des illustrations et 
                des protocoles cliniques.
              </p>
            </div>

            {/* Statistics Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Statistiques</h3>
              </div>
              <AtlasModalStats stats={chapter.stats} />
            </div>

            {/* Actions Section */}
            <div className="pt-4">
              <AtlasModalActions onShare={handleShare} onDownload={handleDownload} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};