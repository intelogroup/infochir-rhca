
import { BookOpen, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner as UILoadingSpinner } from "@/components/ui/loading-spinner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const LoadingSkeleton = () => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex(prev => (prev + 1) % 5);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "relative overflow-hidden rounded-lg group hover:shadow-md transition-all duration-300 border border-gray-100",
            highlightedIndex === i ? "scale-[1.02] shadow-md border-ocean/30" : ""
          )}
        >
          <Skeleton className={cn(
            "w-full h-32",
            highlightedIndex === i 
              ? "bg-gradient-to-r from-ocean/20 via-primary/10 to-ocean/20 animate-pulse" 
              : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 animate-pulse"
          )} />
          <div className={cn(
            "absolute left-0 top-0 h-full w-1.5",
            highlightedIndex === i 
              ? "bg-gradient-to-b from-ocean via-primary to-ocean animate-pulse" 
              : "bg-gradient-to-b from-primary/60 to-ocean/60"
          )}></div>
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              {highlightedIndex === i ? (
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              ) : (
                <BookOpen className="h-3 w-3 text-primary/60" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const LoadingSpinner = () => {
  const [showFunnyMessage, setShowFunnyMessage] = useState(false);
  
  useEffect(() => {
    // After 3 seconds of loading, show a funny message
    const timeout = setTimeout(() => {
      setShowFunnyMessage(true);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center mt-8 py-8">
      <UILoadingSpinner 
        size="lg" 
        variant="fun" 
        text={showFunnyMessage ? "Nos serveurs travaillent à pleine vitesse..." : "Chargement des articles scientifiques..."}
      />
      {showFunnyMessage && (
        <p className="text-center text-sm text-ocean/80 italic mt-2 max-w-md animate-fade-up">
          Patience, la science prend parfois son temps...
        </p>
      )}
      <div className="mt-8">
        <LoadingSkeleton />
      </div>
    </div>
  );
};
