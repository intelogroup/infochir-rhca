
import { StatsLoading } from "./stats/StatsLoading";
import { StatsError } from "./stats/StatsError";
import { StatsCardGrid } from "./stats/StatsCardGrid";
import { StatsDetails } from "./stats/StatsDetails";
import { useStatsData } from "./stats/hooks/useStatsData";

export const StatsSection = () => {
  const { statsData, isLoading, error, refetch } = useStatsData();

  if (isLoading) {
    return <StatsLoading />;
  }

  if (error) {
    console.error('Error fetching stats:', error);
    return <StatsError onRetry={refetch} />;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Statistiques">
      <div className="container mx-auto px-4">
        <StatsDetails />
        <StatsCardGrid statsData={statsData} />
      </div>
    </section>
  );
};
