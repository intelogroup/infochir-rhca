
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, Share2, Download, BookOpen } from "lucide-react";
import { AtlasChapter } from "./types";
import { toast } from "sonner";
import { useState, memo, useCallback, useMemo } from "react";
import { AtlasModal } from "./AtlasModal";
import { motion } from "framer-motion";
import { AtlasCategory } from "./data/atlasCategories";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trackDownload } from "@/lib/analytics/download";
import { supabase } from "@/integrations/supabase/client";

interface AtlasCardProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
}

const AtlasCard = memo(({ chapter, category }: AtlasCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize event handlers to prevent recreation on each render
  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}/adc/chapters/${chapter.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
    
    // Track share count
    if (chapter.id) {
      supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'shares',
        row_id: chapter.id
      }).catch(error => {
        console.error("[AtlasCard] Error incrementing share count:", error);
      });
    }
  }, [chapter.id]);

  const handleDownload = useCallback(async () => {
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
      
      // Track download count
      if (chapter.id) {
        supabase.rpc('increment_count', {
          table_name: 'articles',
          column_name: 'downloads',
          row_id: chapter.id
        }).catch(error => {
          console.error("[AtlasCard] Error incrementing download count:", error);
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erreur lors du téléchargement");
      
      // Track the failed download
      trackDownload({
        document_id: chapter.id,
        document_type: "article", 
        file_name: chapter.pdfUrl.split('/').pop() || 'document.pdf',
        status: 'failed',
        error_details: error instanceof Error ? error.message : 'Unknown error'
      }).catch(e => console.error("Failed to track download error:", e));
    }
  }, [chapter.id, chapter.pdfUrl]);

  // Process the image URL to ensure it works correctly
  const coverImage = useMemo(() => {
    // If chapter has a valid URL, use it
    if (chapter.coverImage && chapter.coverImage.startsWith('http')) {
      return `${chapter.coverImage}?w=320&h=240&fit=cover&q=80`;
    }
    
    // Default fallback images if no valid cover image is available
    const defaultCoverImages = {
      "0": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&fit=crop",
      "1": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&fit=crop",
      "2": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&fit=crop",
      "3": "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=800&fit=crop",
      "4": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&fit=crop",
    };
    
    return `${defaultCoverImages[chapter.id.toString().charAt(0) as keyof typeof defaultCoverImages] || 
            defaultCoverImages["0"]}?w=320&h=240&fit=cover&q=80`;
  }, [chapter.coverImage, chapter.id]);

  const handleModalToggle = useCallback(() => {
    setShowModal(prev => !prev);
    
    // Track view count when opening the modal
    if (!showModal && chapter.id) {
      supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'views',
        row_id: chapter.id
      }).catch(error => {
        console.error("[AtlasCard] Error incrementing view count:", error);
      });
    }
  }, [showModal, chapter.id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

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
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={coverImage}
              alt={chapter.title}
              width={320}
              height={240}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                !imageLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              loading="lazy"
            />
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
              {chapter.publicationDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(chapter.publicationDate).toLocaleDateString('fr-FR')}
                  </span>
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
                  onClick={handleModalToggle}
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
        onOpenChange={handleModalToggle}
      />
    </>
  );
});

AtlasCard.displayName = 'AtlasCard';

export { AtlasCard };
