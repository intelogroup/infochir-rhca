
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Calendar, BookOpen, AlertCircle } from "lucide-react";
import { AtlasChapter } from "./types";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";
import { downloadPDF } from "@/lib/analytics/download";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { Skeleton } from "@/components/ui/skeleton";

const logger = createLogger('AtlasCard');

interface AtlasCardProps {
  chapter: AtlasChapter;
}

export const AtlasCard = ({ chapter }: AtlasCardProps) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageRetries, setImageRetries] = useState(0);
  const MAX_RETRIES = 2;
  
  const handleCardClick = () => {
    navigate(`/adc/chapters/${chapter.id}`);
  };
  
  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!chapter.pdfUrl) {
      toast.error("Aucun PDF disponible pour ce chapitre");
      return;
    }
    
    setIsDownloading(true);
    
    try {
      // Use the improved downloadPDF function
      const success = await downloadPDF({
        url: chapter.pdfUrl,
        fileName: `ADC-${chapter.title.substring(0, 30)}.pdf`,
        documentId: chapter.id,
        documentType: DocumentType.ADC
      });
      
      if (!success) {
        throw new Error("Échec du téléchargement");
      }
      
      toast.success("Téléchargement lancé");
    } catch (error) {
      logger.error(error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!chapter.pdfUrl) {
      toast.error("Aucun PDF disponible pour ce chapitre");
      return;
    }
    
    // Track the view
    try {
      // This simply opens the PDF in a new tab
      window.open(chapter.pdfUrl, '_blank');
    } catch (error) {
      logger.error(error);
      toast.error("Erreur lors de l'ouverture du PDF");
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    logger.log(`[AtlasCard] Image loaded successfully for chapter: ${chapter.id}`);
  };

  const handleImageError = () => {
    if (imageRetries < MAX_RETRIES && chapter.coverImageUrl) {
      logger.warn(`[AtlasCard] Image failed to load, retrying (${imageRetries + 1}/${MAX_RETRIES}): ${chapter.coverImageUrl}`);
      setImageRetries(prev => prev + 1);
      // Force reload by updating the src with a cache-busting parameter
      setTimeout(() => {
        const img = document.querySelector(`[data-chapter-id="${chapter.id}"]`) as HTMLImageElement;
        if (img) {
          img.src = `${chapter.coverImageUrl}?retry=${imageRetries + 1}`;
        }
      }, 500);
    } else {
      logger.error(`[AtlasCard] Image failed to load after ${MAX_RETRIES} retries: ${chapter.coverImageUrl}`);
      setImageError(true);
    }
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col h-full bg-white"
      onClick={handleCardClick}
    >
      <div className="relative h-40 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        {imageError || !chapter.coverImageUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Image non disponible</span>
          </div>
        ) : (
          <img 
            src={chapter.coverImageUrl} 
            alt={chapter.title} 
            data-chapter-id={chapter.id}
            className={`w-full h-full object-cover transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {chapter.category && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-secondary text-white"
          >
            {chapter.category}
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-grow p-4 pt-4">
        <div className="space-y-2">
          {!chapter.coverImageUrl && chapter.category && (
            <Badge variant="outline" className="bg-secondary/10 text-secondary font-medium mb-2">
              {chapter.category}
            </Badge>
          )}
          
          <h3 className="font-medium line-clamp-2 text-lg">
            {chapter.title}
          </h3>
          
          {(chapter.lastUpdate || chapter.lastUpdated) && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Mis à jour le {chapter.lastUpdated || chapter.lastUpdate}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
            {chapter.description || "Pas de description disponible."}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pt-0 pb-4 border-t mt-2 pt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 gap-1 text-xs"
          onClick={handleView}
          disabled={!chapter.pdfUrl}
        >
          <Eye className="h-3.5 w-3.5" />
          Consulter
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 gap-1 text-xs"
          onClick={handleDownload}
          disabled={!chapter.pdfUrl || isDownloading}
        >
          <Download className={`h-3.5 w-3.5 ${isDownloading ? 'animate-pulse' : ''}`} />
          PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AtlasCard;
