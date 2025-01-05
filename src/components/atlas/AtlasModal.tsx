import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User } from "lucide-react";
import { AtlasModalProps } from "./types";
import { toast } from "sonner";
import { AtlasModalHeader } from "./modal/AtlasModalHeader";
import { AtlasModalStats } from "./modal/AtlasModalStats";
import { AtlasModalActions } from "./modal/AtlasModalActions";

export const AtlasModal = ({ chapter, open, onOpenChange }: AtlasModalProps) => {
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
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <AtlasModalHeader title={chapter.title} coverImage={chapter.coverImage} />

        <ScrollArea className="h-[calc(80vh-200px)] px-6">
          <div className="space-y-6 py-6">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {chapter.lastUpdate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>MàJ: {chapter.lastUpdate}</span>
                </div>
              )}
              {chapter.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{chapter.author}</span>
                </div>
              )}
            </div>

            {chapter.description && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {chapter.description}
              </p>
            )}

            <AtlasModalStats stats={chapter.stats} />
            <AtlasModalActions onShare={handleShare} onDownload={handleDownload} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};