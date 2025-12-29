import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Download, 
  Eye,
  BarChart3,
  Activity,
  FileText,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Fetch real analytics summary
const fetchAnalyticsSummary = async () => {
  const { data, error } = await supabase
    .from("admin_analytics_summary")
    .select("*")
    .single();
  
  if (error) throw error;
  return data;
};

// Fetch popular articles
const fetchPopularArticles = async () => {
  const { data, error } = await supabase
    .from("popular_articles_view")
    .select("*")
    .limit(5);
  
  if (error) throw error;
  return data || [];
};

// Fetch daily activity
const fetchDailyActivity = async () => {
  const { data, error } = await supabase
    .from("daily_activity_view")
    .select("*")
    .limit(7);
  
  if (error) throw error;
  return data || [];
};

const MetricCard = ({ title, value, description, icon: Icon, trend, loading }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  loading?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          <div className="text-2xl font-bold">{value?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend !== undefined && trend !== 0 && (
            <div className="flex items-center mt-1">
              {trend > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+{trend}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-xs text-red-600">{trend}%</span>
                </>
              )}
            </div>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const PopularContent = ({ articles, loading }: { articles: any[]; loading: boolean }) => (
  <Card>
    <CardHeader>
      <CardTitle>Contenu populaire</CardTitle>
      <CardDescription>Articles les plus consultés</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Aucun article publié</p>
      ) : (
        <div className="space-y-3">
          {articles.map((item, index) => (
            <div key={item.id || index} className="flex items-center justify-between p-3 border rounded">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views || 0} vues
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {item.downloads || 0} téléchargements
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="ml-2 shrink-0">
                {item.source}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const ActivityChart = ({ dailyData, loading }: { dailyData: any[]; loading: boolean }) => {
  const chartData = dailyData.map(d => ({
    day: format(new Date(d.day), 'EEE', { locale: fr }),
    visites: d.unique_sessions || 0,
    events: d.event_count || 0
  })).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité hebdomadaire</CardTitle>
        <CardDescription>Sessions uniques des 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Aucune activité récente</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visites" fill="hsl(var(--primary))" name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const { 
    data: summary, 
    isLoading: summaryLoading, 
    refetch: refetchSummary 
  } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: fetchAnalyticsSummary,
    staleTime: 30000
  });

  const { 
    data: popularArticles = [], 
    isLoading: articlesLoading 
  } = useQuery({
    queryKey: ['popular-articles'],
    queryFn: fetchPopularArticles,
    staleTime: 30000
  });

  const { 
    data: dailyActivity = [], 
    isLoading: activityLoading 
  } = useQuery({
    queryKey: ['daily-activity'],
    queryFn: fetchDailyActivity,
    staleTime: 30000
  });

  const handleRefresh = () => {
    refetchSummary();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Analytics" 
          description="Statistiques et métriques de la plateforme (données réelles)"
        />
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Sessions mensuelles"
          value={summary?.monthly_unique_sessions || 0}
          description="Sessions uniques (30j)"
          icon={Users}
          loading={summaryLoading}
        />
        
        <MetricCard
          title="Total des vues"
          value={summary?.total_views || 0}
          description="Vues d'articles cumulées"
          icon={Eye}
          loading={summaryLoading}
        />
        
        <MetricCard
          title="Téléchargements"
          value={summary?.total_downloads || 0}
          description="PDFs téléchargés"
          icon={Download}
          loading={summaryLoading}
        />
        
        <MetricCard
          title="Membres"
          value={summary?.total_members || 0}
          description="Membres de l'annuaire"
          icon={Activity}
          loading={summaryLoading}
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularContent articles={popularArticles} loading={articlesLoading} />
        <ActivityChart dailyData={dailyActivity} loading={activityLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Aperçu du contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded">
                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">
                  {summary?.total_rhca_articles || 0}
                </div>
                <div className="text-sm text-muted-foreground">Articles RHCA</div>
              </div>
              <div className="text-center p-4 border rounded">
                <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">
                  {summary?.total_igm_articles || 0}
                </div>
                <div className="text-sm text-muted-foreground">Articles IGM</div>
              </div>
              <div className="text-center p-4 border rounded">
                <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">
                  {summary?.total_index_medicus || 0}
                </div>
                <div className="text-sm text-muted-foreground">Index Medicus</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
