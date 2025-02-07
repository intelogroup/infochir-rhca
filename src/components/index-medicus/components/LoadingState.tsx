
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-32" />
    ))}
  </div>
);

export const LoadingSpinner = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-center gap-2 text-primary">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Chargement des articles...</span>
    </div>
    <LoadingSkeleton />
  </div>
);
