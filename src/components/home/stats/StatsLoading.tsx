
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const StatsLoading = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Statistiques">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <LoadingSpinner variant="fun" text="Chargement des statistiques" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-white shadow-sm rounded-xl">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
