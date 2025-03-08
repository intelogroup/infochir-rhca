
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
      className="bg-white text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center gap-1 px-2 py-0.5 text-xs"
    >
      {showDot && (
        <div className="w-1 h-1 rounded-full bg-green-500 group-hover:bg-white transition-colors" />
      )}
      <span className="whitespace-nowrap">Mise à jour</span>
      <Bell 
        className="w-3 h-3" 
        fill="#F97316"
        color="#F97316"
      />
    </Badge>
  );
};
