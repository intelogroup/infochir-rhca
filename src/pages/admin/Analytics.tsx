
import React, { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DownloadTrackingStatus } from "@/components/admin/DownloadTrackingStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, DownloadCloud, Users, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Analytics = () => {
  // Set up real-time notification for download events
  useEffect(() => {
    const channel = supabase
      .channel('download-events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'download_events'
        },
        (payload) => {
          const docType = payload.new.document_type;
          const status = payload.new.status;
          
          toast.info(`New ${docType} download detected!`, {
            description: `Status: ${status}`,
            position: 'top-right',
            duration: 3000
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics" 
        description="Métriques et statistiques de la plateforme"
      />
      
      <Tabs defaultValue="downloads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <DownloadCloud className="h-4 w-4" />
            Téléchargements
          </TabsTrigger>
          <TabsTrigger value="views" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vues
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="downloads" className="space-y-4">
          <DownloadTrackingStatus />
        </TabsContent>
        
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des vues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cette section sera implémentée prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cette section sera implémentée prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cette section sera implémentée prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
