
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Share2, Tag, Calendar, BookOpen, Share, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface DocumentMetadata {
  id: string;
  title: string;
  date: string;
  description?: string;
  articleCount?: number;
  downloadCount?: number;
  shareCount?: number;
  coverImage?: string;
  pdfUrl?: string;
}

interface DocumentModalProps<T extends DocumentMetadata> {
  document: T;
  open: boolean;
  onClose: () => void;
  renderContent?: (document: T) => React.ReactNode;
  renderActions?: (document: T) => React.ReactNode;
  renderHeader?: (document: T) => React.ReactNode;
}

export const DocumentModal = <T extends DocumentMetadata>({
  document,
  open,
  onClose,
  renderContent,
  renderActions,
  renderHeader,
}: DocumentModalProps<T>) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/rhca/volumes/${document.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    if (!document.pdfUrl) {
      toast.error("Le PDF n'est pas encore disponible");
      return;
    }
    window.open(document.pdfUrl, '_blank');
    toast.success("Téléchargement du PDF en cours...");
  };

  const handleOpenPdf = () => {
    if (!document.pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(document.pdfUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-white/95 backdrop-blur-sm flex flex-col">
        {renderHeader ? (
          renderHeader(document)
        ) : (
          <DialogHeader className="p-3 sm:p-6 pb-0 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary line-clamp-2 leading-tight">
                {document.title}
              </DialogTitle>
            </div>
            {document.description && (
              <DialogDescription className="text-sm sm:text-base text-gray-600 mt-2 break-words">
                {document.description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <motion.div 
            className="p-3 sm:p-6 space-y-4 sm:space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {format(new Date(document.date), 'dd MMMM yyyy', { locale: fr })}
                </div>
                {document.articleCount && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    {document.articleCount} articles
                  </div>
                )}
                {document.downloadCount && (
                  <div className="flex items-center gap-2">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    {document.downloadCount} téléchargements
                  </div>
                )}
                {document.shareCount && (
                  <div className="flex items-center gap-2">
                    <Share className="h-3 w-3 sm:h-4 sm:w-4" />
                    {document.shareCount} partages
                  </div>
                )}
              </div>
              {renderActions ? (
                renderActions(document)
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-9 gap-2 text-xs sm:text-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    Partager
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-9 gap-2 text-xs sm:text-sm"
                    onClick={handleOpenPdf}
                    disabled={!document.pdfUrl}
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    Ouvrir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-9 gap-2 text-xs sm:text-sm"
                    onClick={handleDownload}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    Télécharger PDF
                  </Button>
                </div>
              )}
            </div>

            {renderContent && renderContent(document)}
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
