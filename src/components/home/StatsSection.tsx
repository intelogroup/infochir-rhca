
import { StatsLoading } from "./stats/StatsLoading";
import { StatsError } from "./stats/StatsError";
import { StatsCardGrid } from "./stats/StatsCardGrid";
import { StatsDetails } from "./stats/StatsDetails";
import { useStatsData } from "./stats/hooks/useStatsData";
import { StatsDialog } from "./stats/dialog/StatsDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

export const StatsSection = () => {
  const { statsData, isLoading, error, refetch } = useStatsData();
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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
        
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            className="group"
            onClick={() => setShowDetailsDialog(true)}
          >
            <BarChart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Voir les statistiques détaillées
          </Button>
        </div>
        
        <StatsDialog 
          open={showDetailsDialog} 
          onOpenChange={setShowDetailsDialog} 
        />
      </div>
    </section>
  );
};
