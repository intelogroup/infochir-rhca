import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Download, Share2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { VolumeModal } from "./volume/VolumeModal";
import type { RhcaVolume } from "./types";

interface VolumeCardProps {
  volume: RhcaVolume;
}

export const VolumeCard = ({ volume }: VolumeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card 
        className="h-full hover:shadow-lg transition-shadow cursor-pointer group flex flex-col"
        onClick={() => setIsModalOpen(true)}
        role="article"
        aria-labelledby={`volume-title-${volume.id}`}
      >
        <div className="flex gap-4 p-4 md:p-6 h-full">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div 
              className="w-full md:w-32 h-44 bg-muted rounded-lg overflow-hidden flex-shrink-0"
              style={{ aspectRatio: "3/4" }}
              aria-label={volume.coverImage ? `Couverture du volume ${volume.volume}` : "Image de couverture non disponible"}
            >
              {volume.coverImage ? (
                <img 
                  src={volume.coverImage} 
                  alt=""
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  aria-hidden="true"
                />
              ) : (
                <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                  <span className="text-secondary/20 text-xl font-bold">PDF</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <CardHeader className="p-0 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <CardTitle 
                      id={`volume-title-${volume.id}`}
                      className="text-2xl font-bold text-primary mb-2 truncate"
                    >
                      {volume.volume}
                    </CardTitle>
                    <p 
                      className="text-sm text-gray-500"
                      aria-label={`Date de publication: ${format(new Date(volume.date), 'MMMM yyyy', { locale: fr })}`}
                    >
                      {format(new Date(volume.date), 'MMMM yyyy', { locale: fr })}
                    </p>
                    {volume.description && (
                      <p 
                        className="text-sm text-gray-600 mt-2 line-clamp-2"
                        aria-label="Description du volume"
                      >
                        {volume.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:translate-x-1 transition-transform hidden md:flex"
                    aria-label="Voir les détails"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <div 
                  className="flex flex-wrap items-center gap-4 text-sm text-gray-500"
                  aria-label="Statistiques du volume"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span>{volume.articleCount} articles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>{volume.downloadCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    <span>{volume.shareCount || 0}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>

      <VolumeModal
        volume={volume}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};