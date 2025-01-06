import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { motion } from "framer-motion";

interface AtlasModalActionsProps {
  onShare: () => void;
  onDownload: () => void;
}

export const AtlasModalActions = ({ onShare, onDownload }: AtlasModalActionsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="sticky bottom-0 left-0 right-0 p-4 sm:p-6 bg-background/95 backdrop-blur-sm border-t"
    >
      <div className="flex gap-3 max-w-3xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 text-primary hover:bg-primary/10 hover:text-primary border-primary/20 transition-colors"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1 gap-2"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
          Télécharger le PDF
        </Button>
      </div>
    </motion.div>
  );
};