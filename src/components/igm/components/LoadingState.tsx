import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center p-4 bg-white/50 rounded-xl">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm font-medium">Chargement des numéros...</p>
        </div>
      </div>
      
      {[1, 2].map((i) => (
        <div key={i} className="space-y-4 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((j) => (
              <Skeleton 
                key={j} 
                className="h-[200px] w-full rounded-xl" 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};