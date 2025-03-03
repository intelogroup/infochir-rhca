
import { Button } from "@/components/ui/button";
import { Share2, Download, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { trackDownload } from "@/lib/analytics/download";
import { AtlasChapter } from "../types";
import { motion } from "framer-motion";

interface ModalActionsProps {
  chapter: AtlasChapter;
}

export const ModalActions = ({ chapter }: ModalActionsProps) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/adc/chapters/${chapter.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = async () => {
    if (!chapter.pdfUrl) {
      toast.error("Aucun PDF disponible pour ce chapitre");
      return;
    }
    
    try {
      // Track the download event
      await trackDownload({
        document_id: chapter.id,
        document_type: "article", // Changed from "adc" to "article" to match allowed types
        file_name: chapter.pdfUrl.split('/').pop() || 'document.pdf',
        status: 'success'
      });
      
      // Open the PDF in a new tab
      window.open(chapter.pdfUrl, '_blank');
      toast.success("Téléchargement du PDF...");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erreur lors du téléchargement");
      
      // Track the failed download
      trackDownload({
        document_id: chapter.id,
        document_type: "article", // Changed from "adc" to "article" to match allowed types
        file_name: chapter.pdfUrl.split('/').pop() || 'document.pdf',
        status: 'failed',
        error_details: error instanceof Error ? error.message : 'Unknown error'
      }).catch(e => console.error("Failed to track download error:", e));
    }
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
        onClick={handleDownload}
        disabled={!chapter.pdfUrl}
      >
        <Download className="w-3 h-3" />
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
