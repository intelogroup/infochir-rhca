import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Share2 } from "lucide-react";
import { RhcaVolume } from "../types";
import { toast } from "sonner";

interface VolumeModalProps {
  volume: RhcaVolume;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VolumeModal = ({ volume, open, onOpenChange }: VolumeModalProps) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/rhca/volumes/${volume.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    toast.error("Le téléchargement n'est pas encore disponible");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] sm:h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {volume.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-200px)] sm:h-[calc(80vh-200px)] px-6">
          <div className="space-y-6 py-6">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {volume.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{volume.date}</span>
                </div>
              )}
            </div>

            {volume.description && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {volume.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
                <span>Partager</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5" />
                <span>Télécharger le PDF</span>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};