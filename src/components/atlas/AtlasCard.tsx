
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, Share2, Download, BookOpen, ImageOff } from "lucide-react";
import { AtlasChapter } from "./types";
import { toast } from "sonner";
import { useState, memo } from "react";
import { AtlasModal } from "./AtlasModal";
import { motion } from "framer-motion";
import { AtlasCategory } from "./data/atlasCategories";
import { Badge } from "@/components/ui/badge";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { trackDownload } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('AtlasCard');

interface AtlasCardProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
}

const AtlasCard = memo(({ chapter, category }: AtlasCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
      // Track the download event with correct document type
      await trackDownload({
        document_id: chapter.id,
        document_type: "adc", 
        file_name: chapter.pdfUrl.split('/').pop() || 'document.pdf',
        status: 'success'
      });
      
      // Open the PDF in a new tab
      window.open(chapter.pdfUrl, '_blank');
      toast.success("Téléchargement du PDF...");
    } catch (error) {
      logger.error("Download error:", error);
      toast.error("Erreur lors du téléchargement");
      
      // Track the failed download
      trackDownload({
        document_id: chapter.id,
        document_type: "adc",
        file_name: chapter.pdfUrl.split('/').pop() || 'document.pdf',
        status: 'failed',
        error_details: error instanceof Error ? error.message : 'Unknown error'
      }).catch(e => logger.error("Failed to track download error:", e));
    }
  };

  return (
    <>
      <motion.div
        initial={false}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card className="group h-full flex flex-col overflow-hidden border-transparent hover:border-secondary/30 transition-all duration-300">
          <div className="relative h-32 overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse h-full w-full bg-gray-200"></div>
              </div>
            )}
            
            {imageError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Image unavailable</span>
              </div>
            ) : (
              <ImageOptimizer
                src={chapter.coverImage || ''}
                alt={chapter.title}
                width={320}
                height={240}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                fallbackText={chapter.title}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  console.error(`[AtlasCard] Image load error for ${chapter.id}`);
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
          </div>
          
          <CardHeader className="space-y-2 p-4 flex-grow">
            {category && (
              <Badge variant="secondary" className="w-fit">
                <BookOpen className="h-3 w-3 mr-1" />
                {category.title}
              </Badge>
            )}
            <CardTitle className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2">
              {chapter.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {chapter.lastUpdate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>MàJ: {chapter.lastUpdate}</span>
                </div>
              )}
              {chapter.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{chapter.author}</span>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-0">
            {chapter.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                {chapter.description}
              </p>
            )}
            <div className="flex justify-between items-center">
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-xs hover:bg-secondary/10 hover:text-secondary transition-colors"
                  onClick={() => setShowModal(true)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Consulter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Partager</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  disabled={!chapter.pdfUrl}
                >
                  <Download className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
              {chapter.status === "coming" && (
                <span className="text-xs text-gray-500 italic">À venir</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <AtlasModal 
        chapter={chapter}
        category={category}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  );
});

AtlasCard.displayName = 'AtlasCard';

export { AtlasCard };
