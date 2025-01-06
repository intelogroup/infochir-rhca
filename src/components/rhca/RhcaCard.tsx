import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Eye, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { RhcaVolume } from "./types";

interface RhcaCardProps {
  volume: RhcaVolume;
  onView?: () => void;
}

export const RhcaCard = ({ volume, onView }: RhcaCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/rhca/volumes/${volume.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.error("Le téléchargement n'est pas encore disponible");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-2 p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
          {volume.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
          {volume.date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{volume.date}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        {volume.description && (
          <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
            {volume.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1 sm:flex-none gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Consulter</span>
            <span className="sm:hidden">Voir</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex-1 sm:flex-none gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Partager</span>
            <span className="sm:hidden">Share</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isLoading}
            className="flex-1 sm:flex-none gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Télécharger</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};