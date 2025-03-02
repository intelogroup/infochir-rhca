
import { BookOpen, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
      <div className="relative">
        <div className="animate-pulse bg-primary/5 rounded-full p-2 absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-primary/20" />
        </div>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      <p className="text-primary/80 font-medium mt-3">Chargement des articles scientifiques...</p>
    </div>
    <LoadingSkeleton />
  </div>
);
