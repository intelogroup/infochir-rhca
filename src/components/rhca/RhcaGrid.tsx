import { RhcaCard } from "./RhcaCard";
import { Volume } from "./types";

interface RhcaGridProps {
  volumes: Volume[];
  onVolumeView?: (volume: Volume) => void;
}

export const RhcaGrid = ({ volumes, onVolumeView }: RhcaGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {volumes.map((volume) => (
        <RhcaCard
          key={volume.id}
          volume={volume}
          onView={() => onVolumeView?.(volume)}
        />
      ))}
    </div>
  );
};