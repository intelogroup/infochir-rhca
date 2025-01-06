import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { AtlasChapter, AtlasCategory } from "./types";
import { Calendar, User, Eye, Share2, Download, BookOpen, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AtlasModalProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AtlasModal = ({ chapter, category, open, onOpenChange }: AtlasModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/adc/chapters/${chapter.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    toast.error("Le téléchargement n'est pas encore disponible");
  };

  const defaultCoverImage = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&fit=crop";
  const coverImage = chapter.coverImage || defaultCoverImage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white/80 backdrop-blur-xl">
        <div className="relative">
          <div className="relative h-48 sm:h-64 overflow-hidden">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={coverImage}
              alt={chapter.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-6 text-white"
          >
            {category && (
              <Badge variant="secondary" className="mb-2">
                <BookOpen className="w-3 h-3 mr-1" />
                {category.title}
              </Badge>
            )}
            <h2 className="text-2xl font-bold mb-2">{chapter.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {chapter.lastUpdate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>MàJ: {chapter.lastUpdate}</span>
                </div>
              )}
              {chapter.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{chapter.author}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-sm max-w-none"
          >
            {chapter.description && (
              <p className="text-gray-600 leading-relaxed">{chapter.description}</p>
            )}
            {chapter.tags && chapter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {chapter.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-secondary hover:bg-secondary/90"
            >
              <ArrowUpRight className="w-4 h-4" />
              Consulter
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};