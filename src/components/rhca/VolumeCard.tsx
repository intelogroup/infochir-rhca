import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Download, Share2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { VolumeModal } from "./volume/VolumeModal";
import type { RhcaVolume } from "./types";

const PLACEHOLDER_IMAGES = [
  // Medical research and laboratory
  "https://images.unsplash.com/photo-1579165466741-7f35e4755660",
  "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
  // Medical equipment and technology
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg",
  // Operating rooms and surgical environments
  "https://images.unsplash.com/photo-1551076805-e1869033e561",
  "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg",
  // Medical professionals
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d",
  "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg"
];

const getPlaceholderImage = (id: string) => {
  const index = parseInt(id, 36) % PLACEHOLDER_IMAGES.length;
  return `${PLACEHOLDER_IMAGES[index]}?auto=format&fit=crop&w=400&q=80`;
};

interface VolumeCardProps {
  volume: RhcaVolume;
}

export const VolumeCard = ({ volume }: VolumeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const volumeTitle = `Infochir-RHCA Volume ${volume.volume}, No.${volume.volume}`;

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
                      {volumeTitle}
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
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={volumeTitle}
      />
    </>
  );
};