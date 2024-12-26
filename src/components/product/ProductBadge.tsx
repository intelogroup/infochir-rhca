import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const ProductBadge = () => {
  const [showDot, setShowDot] = useState(true);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setShowDot(prev => !prev);
    }, 1000);

    const timer = setTimeout(() => {
      clearInterval(dotInterval);
    }, 300000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Badge 
      variant="secondary" 
      className="bg-white text-primary flex items-center gap-2"
    >
      {showDot && (
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
      )}
      <span>Mise à jour disponible</span>
      <Bell 
        className="w-4 h-4" 
        fill="#F97316"
        color="#F97316"
      />
    </Badge>
  );
};