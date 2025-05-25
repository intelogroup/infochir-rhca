
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

  const handleViewArticle = () => {
    if (document.pdfUrl) {
      // Open PDF directly in new tab
      window.open(document.pdfUrl, '_blank');
    } else {
      toast.error("Article non disponible");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        {renderHeader ? (
          renderHeader(document)
        ) : (
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[clamp(1.5rem,1.35rem+0.75vw,2rem)] font-bold text-primary">
                {document.title}
              </DialogTitle>
            </div>
            {document.description && (
              <DialogDescription className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 mt-2">
                {document.description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        
        <ScrollArea className="max-h-[80vh]">
          <motion.div 
            className="p-6 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(document.date), 'dd MMMM yyyy', { locale: fr })}
                </div>
                {document.articleCount && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {document.articleCount} articles
                  </div>
                )}
                {document.downloadCount && (
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    {document.downloadCount} téléchargements
                  </div>
                )}
                {document.shareCount && (
                  <div className="flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    {document.shareCount} partages
                  </div>
                )}
              </div>
              {renderActions ? (
                renderActions(document)
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)]"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    Partager
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)]"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                    Télécharger PDF
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)]"
                    onClick={handleViewArticle}
                  >
                    <FileText className="h-4 w-4" />
                    Consulter l'article
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
