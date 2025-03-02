
import { BookOpen, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner as UILoadingSpinner } from "@/components/ui/loading-spinner";

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="relative overflow-hidden rounded-md">
        <Skeleton className="w-full h-32 bg-gray-100" />
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/40 to-secondary/40"></div>
      </div>
    ))}
  </div>
);

export const LoadingSpinner = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <UILoadingSpinner 
        size="lg" 
        variant="medical" 
        text="Chargement des articles scientifiques..."
      />
    </div>
    <LoadingSkeleton />
  </div>
);
