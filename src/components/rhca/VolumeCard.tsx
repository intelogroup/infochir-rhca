import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Download, Share2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { VolumeModal } from "./volume/VolumeModal";
import type { RhcaVolume } from "./types";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
];

const getPlaceholderImage = (id: string) => {
  // Use the volume id to consistently get the same placeholder image
  const index = parseInt(id, 36) % PLACEHOLDER_IMAGES.length;
  return `${PLACEHOLDER_IMAGES[index]}?auto=format&fit=crop&w=400&q=80`;
};

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
              className="relative w-full md:w-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden"
              style={{ aspectRatio: "3/4" }}
              aria-label={volume.coverImage ? `Couverture du volume ${volume.volume}` : "Image de couverture non disponible"}
            >
              <img 
                src={volume.coverImage || getPlaceholderImage(volume.id)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <CardHeader className="p-0 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <CardTitle 
                      id={`volume-title-${volume.id}`}
                      className="text-primary mb-2 truncate"
                      style={{ fontSize: 'clamp(1rem, 0.85rem + 0.5vw, 1.25rem)' }}
                    >
                      {`Infochir-RHCA Volume ${volume.volume}, No.${volume.volume}`}
                    </CardTitle>
                    <p 
                      className="text-gray-500"
                      style={{ fontSize: 'clamp(0.875rem, 0.8rem + 0.3vw, 1rem)' }}
                      aria-label={`Date de publication: ${format(new Date(volume.date), 'MMMM yyyy', { locale: fr })}`}
                    >
                      {format(new Date(volume.date), 'MMMM yyyy', { locale: fr })}
                    </p>
                    {volume.description && (
                      <p 
                        className="text-gray-600 mt-2 line-clamp-2"
                        style={{ fontSize: 'clamp(0.875rem, 0.8rem + 0.3vw, 1rem)' }}
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
                  className="flex flex-wrap items-center gap-4 text-gray-500"
                  style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)' }}
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