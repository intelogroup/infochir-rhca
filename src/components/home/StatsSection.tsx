
import { defaultStats } from "./stats/StatsData";
import { StatsCard } from "@/components/ui/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw, BarChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export const StatsSection = () => {
  const [statsDetailsOpen, setStatsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: statsData, isLoading, error, refetch } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      console.log('Fetching home stats...');
      
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, views');
      
      if (articlesError) throw articlesError;

      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id');
      
      if (membersError) throw membersError;
      
      // Get total downloads
      const { data: downloads, error: downloadsError } = await supabase
        .rpc('get_total_downloads');
        
      if (downloadsError) throw downloadsError;

      const stats = [...defaultStats];
      
      // Don't override the first stat value since we've set it statically to 95
      
      // Update Members count
      stats[1].value = members?.length?.toString() || "0";
      
      // Update Views count
      const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0);
      stats[2].value = totalViews?.toString() || "0";
      
      // Update Downloads count
      stats[3].value = downloads?.toString() || "0";

      console.log('Processed stats:', stats);
      return stats;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query for detailed download stats
  const { data: downloadStats, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['download-stats-details'],
    queryFn: async () => {
      // Only fetch detailed stats when dialog is open
      if (!statsDetailsOpen) return null;
      
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
    enabled: statsDetailsOpen,
    staleTime: 60 * 1000, // 1 minute
  });

  const openStatsDetails = () => {
    setStatsDetailsOpen(true);
  };

  if (isLoading) {
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
  }

  if (error) {
    console.error('Error fetching stats:', error);
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Erreur de chargement">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Une erreur est survenue lors du chargement des statistiques.
                </AlertDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Réessayer
            </Button>
          </Alert>
        </div>
      </section>
    );
  }

  // Prepare data for charts
  const prepareTypeData = () => {
    if (!downloadStats?.byType) return [];
    
    return downloadStats.byType.map(item => ({
      name: item.document_type.toUpperCase(),
      downloads: item.count,
      status: item.status
    }));
  };
  
  const prepareDailyData = () => {
    if (!downloadStats?.daily) return [];
    
    return downloadStats.daily.map(item => ({
      date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      total: Number(item.total_downloads),
      success: Number(item.successful_downloads),
      failed: Number(item.failed_downloads)
    }));
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Statistiques">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nos chiffres clés
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            L'impact de notre travail en quelques statistiques
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={openStatsDetails}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Voir les détails
          </Button>
        </motion.div>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          role="list"
          aria-label="Liste des statistiques"
        >
          {(statsData || defaultStats).map((stat, index) => (
            <motion.div 
              key={index} 
              role="listitem" 
              className="transform transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Details Dialog */}
      <Dialog open={statsDetailsOpen} onOpenChange={setStatsDetailsOpen}>
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
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé des statistiques</CardTitle>
                  <CardDescription>Vue générale de nos activités</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(statsData || defaultStats).map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-center mb-2">
                          <stat.icon className={`h-6 w-6 ${stat.iconClassName}`} />
                        </div>
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="downloads" className="space-y-4">
              {isLoadingDetails ? (
                <Card>
                  <CardContent className="flex justify-center items-center py-8">
                    <LoadingSpinner text="Chargement des données" />
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Téléchargements par jour</CardTitle>
                      <CardDescription>Les 7 derniers jours</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={prepareDailyData()} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="success" name="Réussis" fill="#10b981" />
                          <Bar dataKey="failed" name="Échoués" fill="#ef4444" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Téléchargements par type de document</CardTitle>
                      <CardDescription>Distribution des téléchargements réussis</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={prepareTypeData().filter(item => item.status === 'success')}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="downloads"
                              nameKey="name"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {prepareTypeData().filter(item => item.status === 'success').map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} téléchargements`, 'Quantité']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <h4 className="text-lg font-semibold mb-4">Répartition des téléchargements</h4>
                        <ul className="space-y-3">
                          {prepareTypeData()
                            .filter(item => item.status === 'success')
                            .map((item, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="font-medium">{item.name}: </span>
                                <span className="ml-2">{item.downloads} téléchargements</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  );
};
