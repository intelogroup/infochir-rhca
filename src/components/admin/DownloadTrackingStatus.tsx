
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  checkDownloadEventsConnection, 
  getDownloadTypeStats, 
  verifyTrackingSystem 
} from '@/lib/analytics/download/storage/check-connection';
import { toast } from 'sonner';

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
  } | null>(null);

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
      setConnectionStats({
        connected: connection.connected,
        count: connection.count,
        recentEvents: connection.recentEvents
      });
      
      toast.success("Status check completed successfully");
    } catch (error) {
      console.error("Error checking download tracking status:", error);
      toast.error("Failed to check download tracking status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Statut du suivi des téléchargements</span>
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
          <>
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
                
                {connectionStats.count > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Événements récents</h4>
                    <div className="max-h-40 overflow-y-auto text-xs">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {connectionStats.recentEvents.map((event, index) => (
                            <tr key={index}>
                              <td className="px-2 py-1 whitespace-nowrap">{event.document_type}</td>
                              <td className="px-2 py-1 truncate max-w-[120px]">{event.document_id}</td>
                              <td className="px-2 py-1 whitespace-nowrap">
                                <Badge variant={event.status === 'success' ? 'success' : 'destructive'}>
                                  {event.status}
                                </Badge>
                              </td>
                              <td className="px-2 py-1 whitespace-nowrap">
                                {new Date(event.created_at).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Type Stats */}
            {typeStats.length > 0 && (
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Statistiques par type de document</h3>
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
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        La dernière vérification a été effectuée le {new Date().toLocaleString()}
      </CardFooter>
    </Card>
  );
};
