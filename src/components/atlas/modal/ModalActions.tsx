
import { Button } from "@/components/ui/button";
import { Share2, Download, ArrowUpRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { downloadPDF } from "@/lib/analytics/download";
import { AtlasChapter } from "../types";
import { motion } from "framer-motion";
import { createLogger } from "@/lib/error-logger";
import { useState } from "react";
import { trackShare } from "@/lib/analytics/track";
import { DocumentType } from "@/lib/analytics/download/statistics/types";

const logger = createLogger('ModalActions');

interface ModalActionsProps {
  chapter: AtlasChapter;
}

export const ModalActions = ({ chapter }: ModalActionsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/adc/chapters/${chapter.id}`;
    await navigator.clipboard.writeText(shareUrl);
    
    try {
      await trackShare(chapter.id, DocumentType.ADC, 'clipboard');
    } catch (error) {
      logger.error('Error tracking share event:', error);
    }
    
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = async () => {
    if (!chapter.pdfUrl) {
      toast.error("Aucun PDF disponible pour ce chapitre");
      return;
    }
    
    try {
      setIsDownloading(true);
      
      const fileName = `ADC-${chapter.title.slice(0, 30)}.pdf`;
      
      const success = await downloadPDF({
        url: chapter.pdfUrl,
        fileName,
        documentId: chapter.id,
        documentType: DocumentType.ADC,
        trackingEnabled: true
      });
      
      if (!success) {
        throw new Error('Download failed');
      }
    } catch (error) {
      logger.error(error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenPdf = () => {
    if (!chapter.pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(chapter.pdfUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 flex flex-wrap gap-2 p-4 pt-0"
    >
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 hover:bg-gray-100/80 transition-colors"
        onClick={handleShare}
      >
        <Share2 className="w-3 h-3" />
        Partager
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 hover:bg-gray-100/80 transition-colors"
        onClick={handleOpenPdf}
        disabled={!chapter.pdfUrl}
      >
        <ExternalLink className="w-3 h-3" />
        Ouvrir
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 hover:bg-gray-100/80 transition-colors"
        onClick={handleDownload}
        disabled={!chapter.pdfUrl || isDownloading}
      >
        <Download className={`w-3 h-3 ${isDownloading ? 'animate-pulse' : ''}`} />
        PDF
      </Button>
      <Button
        variant="default"
        size="sm"
        className="h-8 text-xs gap-1.5 bg-secondary hover:bg-secondary/90 transition-colors"
        onClick={() => chapter.pdfUrl && window.open(chapter.pdfUrl, '_blank')}
        disabled={!chapter.pdfUrl}
      >
        <ArrowUpRight className="w-3 h-3" />
        Consulter
      </Button>
    </motion.div>
  );
};
