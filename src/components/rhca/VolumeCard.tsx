import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaVolume } from "./types";

interface VolumeCardProps {
  volume: RhcaVolume;
  onClick: (volume: RhcaVolume) => void;
}

export const VolumeCard = ({ volume, onClick }: VolumeCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onClick(volume)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              Volume {volume.volume}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {format(new Date(volume.date), 'MMMM yyyy', { locale: fr })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="group-hover:translate-x-1 transition-transform"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {volume.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {volume.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {volume.articleCount} articles
          </div>
        </div>
      </CardContent>
    </Card>
  );
};