import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BarChart3, FilePieChart, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('AnalyticsDashboard');

interface EventSummary {
  event_type: string;
  event_count: number;
}

interface DailyEventSummary {
  day: string;
  event_type: string;
  document_type: string | null;
  event_count: number;
}

export const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [eventSummary, setEventSummary] = useState<EventSummary[]>([]);
  const [dailyEvents, setDailyEvents] = useState<DailyEventSummary[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get event summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('analytics_dashboard')
        .select('*')
        .order('day', { ascending: false })
        .limit(100);
      
      if (summaryError) {
        throw summaryError;
      }
      
      if (summaryData) {
        setDailyEvents(summaryData);
        
        // Aggregate events by type
        const summary: Record<string, number> = {};
        summaryData.forEach((item) => {
          const { event_type, event_count } = item;
          summary[event_type] = (summary[event_type] || 0) + event_count;
        });
        
        // Convert to array for display
        const summaryArray = Object.entries(summary).map(([event_type, event_count]) => ({
          event_type,
          event_count,
        }));
        
        // Sort by count descending
        summaryArray.sort((a, b) => b.event_count - a.event_count);
        
        setEventSummary(summaryArray);
      }
    } catch (error) {
      logger.error('Error fetching analytics:', error);
      toast.error('Une erreur est survenue lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>
              Tableau de bord des activités
            </CardTitle>
            <CardDescription>
              Analyse des événements et interactions des utilisateurs sur la plateforme
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Actualisation...</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> Actualiser</>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement des statistiques...</p>
          </div>
        ) : (
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">
                <BarChart3 className="h-4 w-4 mr-2" />
                Résumé
              </TabsTrigger>
              <TabsTrigger value="details">
                <FilePieChart className="h-4 w-4 mr-2" />
                Détails par jour
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventSummary.map((event, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md capitalize">
                        {event.event_type === 'view' ? 'Vues' : 
                         event.event_type === 'download' ? 'Téléchargements' :
                         event.event_type === 'share' ? 'Partages' :
                         event.event_type === 'search' ? 'Recherches' :
                         event.event_type === 'click' ? 'Clics' : event.event_type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{event.event_count}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="pt-4">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Date
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Événement
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type de document
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dailyEvents.map((event, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(event.day)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {event.event_type === 'view' ? 'Vues' : 
                             event.event_type === 'download' ? 'Téléchargements' :
                             event.event_type === 'share' ? 'Partages' :
                             event.event_type === 'search' ? 'Recherches' :
                             event.event_type === 'click' ? 'Clics' : event.event_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {event.document_type || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {event.event_count}
                          </td>
                        </tr>
                      ))}
                      
                      {dailyEvents.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                            Aucune donnée disponible
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
