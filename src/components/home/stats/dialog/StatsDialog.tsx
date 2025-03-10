
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OverviewTab } from "./tabs/OverviewTab";
import { DownloadsTab } from "./tabs/DownloadsTab";

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StatsDialog: React.FC<StatsDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Query for detailed download stats
  const { data: downloadStats, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['download-stats-details'],
    queryFn: async () => {
      // Only fetch detailed stats when dialog is open
      if (!open) return null;
      
      // Get download stats by type
      const { data: downloadsByType, error: typeError } = await supabase
        .from('download_stats_monitoring')
        .select('*');
      
      if (typeError) throw typeError;
      
      // Get daily download stats for past 7 days
      const { data: dailyStats, error: dailyError } = await supabase
        .rpc('get_daily_downloads', { days_back: 7 });
        
      if (dailyError) throw dailyError;
      
      return {
        byType: downloadsByType || [],
        daily: dailyStats || []
      };
    },
    enabled: open,
    staleTime: 60 * 1000, // 1 minute
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Analyse détaillée des statistiques</DialogTitle>
          <DialogDescription>
            Explorez en détail les téléchargements et autres métriques
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="downloads">Téléchargements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="downloads">
            <DownloadsTab downloadStats={downloadStats} isLoading={isLoadingDetails} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
