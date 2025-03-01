import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import type { RhcaVolume } from "./types";

interface VolumeCardProps {
  volume: RhcaVolume;
  onClick?: () => void;
}

export const VolumeCard: React.FC<VolumeCardProps> = ({ volume, onClick }) => {
  const {
    title,
    volume: volumeNumber,
    issue,
    date,
    availability = "available",
    specialty,
    category,
  } = volume;

  const badgeVariants: Record<RhcaVolume["availability"], string> = {
    available: "bg-green-100 text-green-800",
    unavailable: "bg-red-100 text-red-800",
    coming_soon: "bg-blue-100 text-blue-800",
  };

  const badgeText: Record<RhcaVolume["availability"], string> = {
    available: "Disponible",
    unavailable: "Indisponible",
    coming_soon: "À venir",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="group hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
            <Badge variant="secondary" className={badgeVariants[availability]}>
              {badgeText[availability]}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">
              Volume {volumeNumber}, Numéro {issue}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(date), "MMMM yyyy", { locale: fr })}
            </p>
            {specialty && (
              <p className="text-sm text-gray-500">Spécialité: {specialty}</p>
            )}
            {category && (
              <p className="text-sm text-gray-500">Catégorie: {category}</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
