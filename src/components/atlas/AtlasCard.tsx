
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Calendar, BookOpen } from "lucide-react";
import { AtlasChapter } from "./types";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";
import { downloadPDF } from "@/lib/analytics/download";
import { DocumentType } from "@/lib/analytics/download/statistics/types";

const logger = createLogger('AtlasCard');

interface AtlasCardProps {
  chapter: AtlasChapter;
}

export const AtlasCard = ({ chapter }: AtlasCardProps) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  
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
      // Use our tracking function
      // This simply opens the PDF in a new tab
      window.open(chapter.pdfUrl, '_blank');
    } catch (error) {
      logger.error(error);
      toast.error("Erreur lors de l'ouverture du PDF");
    }
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col h-full bg-white"
      onClick={handleCardClick}
    >
      {chapter.coverImageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img 
            src={chapter.coverImageUrl} 
            alt={chapter.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          </div>
          {chapter.category && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 bg-secondary text-white"
            >
              {chapter.category}
            </Badge>
          )}
        </div>
      )}
      
      <CardContent className={`flex-grow p-4 ${!chapter.coverImageUrl ? 'pt-4' : 'pt-4'}`}>
        <div className="space-y-2">
          {!chapter.coverImageUrl && chapter.category && (
            <Badge variant="outline" className="bg-secondary/10 text-secondary font-medium mb-2">
              {chapter.category}
            </Badge>
          )}
          
          <h3 className="font-medium line-clamp-2 text-lg">
            {chapter.title}
          </h3>
          
          {chapter.lastUpdate && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Mis à jour le {new Date(chapter.lastUpdate).toLocaleDateString('fr-FR')}
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
