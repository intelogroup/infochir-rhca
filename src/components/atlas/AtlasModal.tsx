import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User, Eye, Share2, Download } from "lucide-react";
import { AtlasModalProps } from "./types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
        <div className="relative h-[200px] w-full">
          {chapter.coverImage && (
            <img
              src={chapter.coverImage}
              alt={chapter.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
          <DialogHeader className="absolute bottom-4 left-6 right-6">
            <DialogTitle className="text-3xl font-bold text-white">
              {chapter.title}
            </DialogTitle>
          </DialogHeader>
        </div>

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

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Eye className="h-8 w-8 text-primary mb-2" />
                <span className="text-3xl font-bold text-primary">
                  {chapter.stats?.views || 0}
                </span>
                <span className="text-sm text-gray-500">Vues</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Share2 className="h-8 w-8 text-primary mb-2" />
                <span className="text-3xl font-bold text-primary">
                  {chapter.stats?.shares || 0}
                </span>
                <span className="text-sm text-gray-500">Partages</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Download className="h-8 w-8 text-primary mb-2" />
                <span className="text-3xl font-bold text-primary">
                  {chapter.stats?.downloads || 0}
                </span>
                <span className="text-sm text-gray-500">Téléchargements</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Partager
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5 mr-2" />
                Télécharger le PDF
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};