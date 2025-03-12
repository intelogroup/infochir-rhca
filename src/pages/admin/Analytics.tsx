
import React from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { DownloadTrackingStatus } from "@/components/admin/DownloadTrackingStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="container space-y-6 py-8">
        <PageHeader 
          title="Statistiques et Suivi" 
          subtitle="Surveillez les performances de l'application et le suivi des téléchargements" 
        />

        <Tabs defaultValue="downloads">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="downloads">Téléchargements</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="downloads" className="space-y-4 pt-4">
            <DownloadTrackingStatus />
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4 pt-4">
            <div className="rounded-lg border p-8 text-center">
              <p className="text-muted-foreground">
                Les statistiques de performance seront disponibles prochainement.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
