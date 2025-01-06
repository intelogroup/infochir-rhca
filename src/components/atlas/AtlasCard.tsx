import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, Share2, Download } from "lucide-react";
import { AtlasChapter } from "./types";
import { toast } from "sonner";
import { useState } from "react";
import { AtlasModal } from "./AtlasModal";
import { motion } from "framer-motion";

interface AtlasCardProps {
  chapter: AtlasChapter;
}

export const AtlasCard = ({ chapter }: AtlasCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/adc/chapters/${chapter.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = () => {
    toast.error("Le téléchargement n'est pas encore disponible");
  };

  // Default cover images based on chapter categories
  const defaultCoverImages = {
    "0": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&fit=crop",
    "1": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1470&fit=crop",
    "2": "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1470&fit=crop",
    "3": "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1470&fit=crop",
    "4": "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1470&fit=crop",
  };

  const coverImage = chapter.coverImage || defaultCoverImages[chapter.id as keyof typeof defaultCoverImages] || defaultCoverImages["0"];

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img
              src={coverImage}
              alt={chapter.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
          </div>
          <CardHeader className="space-y-2 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {chapter.title}
            </CardTitle>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              {chapter.lastUpdate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>MàJ: {chapter.lastUpdate}</span>
                </div>
              )}
              {chapter.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{chapter.author}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
            {chapter.description && (
              <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                {chapter.description}
              </p>
            )}
            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1 sm:gap-2 text-xs sm:text-sm hover:text-primary transition-colors h-8 sm:h-9"
                  onClick={() => setShowModal(true)}
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Consulter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Partager</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
              {chapter.status === "coming" && (
                <span className="text-xs sm:text-sm text-gray-500 italic">À venir</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <AtlasModal 
        chapter={chapter}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  );
};