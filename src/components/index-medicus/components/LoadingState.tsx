
import { BookOpen, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner as UILoadingSpinner } from "@/components/ui/loading-spinner";

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="relative overflow-hidden rounded-md group hover:shadow-md transition-all duration-300">
        <Skeleton className="w-full h-32 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary/60 to-secondary/60"></div>
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-3 w-3 text-primary/40" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const LoadingSpinner = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <UILoadingSpinner 
        size="lg" 
        variant="medical" 
        text="Chargement des articles scientifiques..."
      />
    </div>
    <LoadingSkeleton />
  </div>
);
