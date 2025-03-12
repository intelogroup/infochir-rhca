
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, RefreshCw, FileDown, Calendar, Link2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  checkDownloadEventsConnection, 
  getDownloadTypeStats, 
  verifyTrackingSystem,
} from '@/lib/analytics/download/storage/check-connection';
import { trackDownload } from '@/lib/analytics/download';
import { toast } from 'sonner';
import { createLogger } from "@/lib/error-logger";
import { supabase } from "@/integrations/supabase/client";

const logger = createLogger('DownloadTrackingStatus');

export const DownloadTrackingStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<{
    isWorking: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [typeStats, setTypeStats] = useState<{
    type: string;
    count: number;
    successful: number;
    failed: number;
  }[]>([]);
  const [connectionStats, setConnectionStats] = useState<{
    connected: boolean;
    count: number;
    recentEvents: any[];
    error?: string;
  } | null>(null);
  const [dailyStats, setDailyStats] = useState<{
    date: string;
    total: number;
    successful: number;
    failed: number;
  }[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const checkSystemStatus = async () => {
    setIsLoading(true);
    try {
      // Verify the overall tracking system
      const status = await verifyTrackingSystem();
      setSystemStatus(status);
      
      // Get download stats by document type
      const stats = await getDownloadTypeStats();
      if (!stats.error) {
        setTypeStats(stats.documentTypes);
      }
      
      // Get connection stats
      const connection = await checkDownloadEventsConnection();
      setConnectionStats(connection);
      
      // Get daily stats
      try {
        const { data: dailyData } = await supabase
          .rpc('get_daily_downloads', { days_back: 7 });
        
        if (dailyData) {
          setDailyStats(dailyData.map((item: any) => ({
            date: new Date(item.date).toLocaleDateString(),
            total: item.total_downloads,
            successful: item.successful_downloads,
            failed: item.failed_downloads
          })));
        }
      } catch (dailyError) {
        logger.error('Error fetching daily stats:', dailyError);
      }
      
      toast.success("Status check completed successfully");
    } catch (error) {
      logger.error("Error checking download tracking status:", error);
      toast.error("Failed to check download tracking status");
    } finally {
      setIsLoading(false);
    }
  };

  const runTestDownload = async () => {
    setIsTesting(true);
    try {
      const result = await trackDownload({
        document_id: '00000000-0000-0000-0000-000000000000',
        document_type: 'test',
        file_name: 'test-file.pdf',
        status: 'success'
      });
      
      if (result) {
        toast.success("Test download event recorded successfully");
      } else {
        toast.error("Failed to record test download event");
      }
      
      // Refresh the status to see the new test event
      await checkSystemStatus();
    } catch (error) {
      logger.error('Error running test download:', error);
      toast.error("Error running test download");
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    checkSystemStatus();
    
    // Set up real-time subscription to download_events table
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
          toast.info("New download event detected!", {
            description: `Document: ${payload.new.document_type}`,
            duration: 3000
          });
          checkSystemStatus();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Statut du suivi des téléchargements</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runTestDownload} 
              disabled={isLoading || isTesting}
            >
              {isTesting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Test en cours...</>
              ) : (
                <><FileDown className="h-4 w-4 mr-2" /> Tester le suivi</>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSystemStatus} 
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Vérification...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-2" /> Rafraîchir</>
              )}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Vérifiez si le système de suivi des téléchargements fonctionne correctement
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Vérification de la connexion Supabase...</p>
          </div>
        ) : (
          <Tabs defaultValue="status">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status">État du système</TabsTrigger>
              <TabsTrigger value="details">Événements récents</TabsTrigger>
              <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="space-y-4 pt-4">
              {/* System Status */}
              <Alert variant={systemStatus?.isWorking ? "default" : "destructive"}>
                {systemStatus?.isWorking ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {systemStatus?.isWorking 
                    ? "Le système fonctionne correctement" 
                    : "Problème détecté"}
                </AlertTitle>
                <AlertDescription>
                  {systemStatus?.message}
                </AlertDescription>
              </Alert>
              
              {/* Connection Stats */}
              {connectionStats && (
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium mb-2">Connexion à la base de données</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant={connectionStats.connected ? "success" : "destructive"}>
                      {connectionStats.connected ? "Connecté" : "Non connecté"}
                    </Badge>
                    <Badge variant="outline">
                      {connectionStats.count} événements enregistrés
                    </Badge>
                  </div>
                  
                  {connectionStats.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erreur de connexion</AlertTitle>
                      <AlertDescription>
                        {connectionStats.error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Informations de débogage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="rounded border p-3">
                        <span className="text-sm font-medium">Vérifier la table download_events</span>
                        <div className="flex flex-col mt-1 text-sm">
                          <code className="text-xs bg-gray-100 p-1 rounded">
                            SELECT * FROM download_events ORDER BY created_at DESC LIMIT 10;
                          </code>
                        </div>
                      </div>
                      <div className="rounded border p-3">
                        <span className="text-sm font-medium">Solutions possibles</span>
                        <ul className="text-xs mt-1 list-disc list-inside">
                          <li>Vérifier les droits d'accès à la table</li>
                          <li>Vérifier que le trigger est actif</li>
                          <li>Tester un téléchargement manuel</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              {connectionStats?.count ? (
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-2">Événements récents</h4>
                  <div className="max-h-96 overflow-y-auto text-xs border rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fichier</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {connectionStats.recentEvents.map((event, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {new Date(event.created_at).toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <Badge variant="outline">{event.document_type}</Badge>
                            </td>
                            <td className="px-3 py-2 truncate max-w-[120px]">
                              <span title={event.document_id}>{event.document_id.substring(0, 8)}...</span>
                            </td>
                            <td className="px-3 py-2 truncate max-w-[120px]">
                              <span title={event.file_name}>{event.file_name}</span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <Badge variant={event.status === 'success' ? 'success' : 'destructive'}>
                                {event.status}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 truncate max-w-[120px]">
                              <span title={event.user_agent}>
                                {event.user_agent ? event.user_agent.substring(0, 15) + '...' : 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <FileDown className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun événement trouvé</h3>
                  <p className="text-gray-500">
                    Aucun téléchargement n'a encore été enregistré ou le système de suivi ne fonctionne pas correctement.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={runTestDownload} 
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Test en cours...</>
                    ) : (
                      <><FileDown className="h-4 w-4 mr-2" /> Créer un événement de test</>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="statistics" className="space-y-4 pt-4">
              {/* Type Stats */}
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Statistiques par type de document</h3>
                {typeStats.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {typeStats.map((stat, index) => (
                      <div key={index} className="rounded border p-3">
                        <span className="text-sm font-medium">{stat.type}</span>
                        <div className="flex flex-col mt-1 text-sm">
                          <span>Total: {stat.count}</span>
                          <span className="text-green-500">Réussis: {stat.successful}</span>
                          {stat.failed > 0 && (
                            <span className="text-red-500">Échoués: {stat.failed}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center p-4">
                    Aucune donnée statistique disponible
                  </p>
                )}
              </div>
              
              {/* Daily Stats */}
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Téléchargements par jour (7 derniers jours)</h3>
                {dailyStats.length > 0 ? (
                  <div className="space-y-2">
                    {dailyStats.map((day, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-24 flex-shrink-0">
                          <span className="text-xs flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {day.date}
                          </span>
                        </div>
                        <div className="flex-grow h-7 bg-gray-100 rounded-full overflow-hidden">
                          {day.total > 0 && (
                            <div 
                              className="h-7 bg-green-500 rounded-l-full flex items-center pl-2"
                              style={{ width: `${(day.successful / day.total) * 100}%` }}
                            >
                              <span className="text-xs text-white">{day.successful}</span>
                            </div>
                          )}
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-xs font-medium">{day.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center p-4">
                    Aucune donnée quotidienne disponible
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-xs flex justify-between items-center text-muted-foreground">
        <span>La dernière vérification a été effectuée le {new Date().toLocaleString()}</span>
        <Link2 className="h-3 w-3" />
      </CardFooter>
    </Card>
  );
};
