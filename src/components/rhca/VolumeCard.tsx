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
        className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex gap-6 p-6">
          <div className="w-32 h-44 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            {volume.coverImage ? (
              <img 
                src={volume.coverImage} 
                alt={`Couverture ${volume.volume}`}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                <span className="text-secondary/20 text-xl font-bold">PDF</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <CardHeader className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-primary mb-2">
                    {volume.volume}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {format(new Date(volume.date), 'MMMM yyyy', { locale: fr })}
                  </p>
                  {volume.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {volume.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {volume.articleCount} articles
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {volume.downloadCount || 0}
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  {volume.shareCount || 0}
                </div>
              </div>
            </CardContent>
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