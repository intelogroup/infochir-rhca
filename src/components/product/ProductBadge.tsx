
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const ProductBadge = () => {
  const [showDot, setShowDot] = useState(true);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setShowDot(prev => !prev);
    }, 1500); // Slower pulse for subtlety

    const timer = setTimeout(() => {
      clearInterval(dotInterval);
    }, 300000); // Stop after 5 minutes

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      {/* Animated dot outside of badge text */}
      <div 
        className={`w-2 h-2 rounded-full transition-all duration-700 ${
          showDot 
            ? "bg-green-400 opacity-100 scale-100" 
            : "bg-green-300 opacity-30 scale-90"
        }`}
      />
      
      {/* Badge text with proper padding */}
      <Badge 
        variant="secondary" 
        className="bg-white text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full shadow-sm"
      >
        <span className="whitespace-nowrap">Mise à jour</span>
        <Bell 
          className="w-2.5 h-2.5" 
          fill="#F97316"
          color="#F97316"
        />
      </Badge>
    </div>
  );
};
