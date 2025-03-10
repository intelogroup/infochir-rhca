
import { StatsLoading } from "./stats/StatsLoading";
import { StatsError } from "./stats/StatsError";
import { StatsCardGrid } from "./stats/StatsCardGrid";
import { StatsDetails } from "./stats/StatsDetails";
import { useStatsData } from "./stats/hooks/useStatsData";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('StatsSection');

export const StatsSection = () => {
  // The useStatsData hook now includes real-time subscription logic
  const { statsData, isLoading, error, refetch } = useStatsData();

  if (isLoading) {
    return <StatsLoading />;
  }

  if (error) {
    logger.error('Error fetching stats:', error);
    return <StatsError onRetry={refetch} />;
  }

  // Ensure we have valid data
  if (!statsData || !Array.isArray(statsData) || statsData.length < 4) {
    logger.error('Invalid stats data received:', statsData);
    return <StatsError onRetry={refetch} />;
  }

  // Log for debugging
  logger.log('Rendering stats with data:', statsData);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Statistiques">
      <div className="container mx-auto px-4">
        <StatsDetails />
        <StatsCardGrid statsData={statsData} />
      </div>
    </section>
  );
};
