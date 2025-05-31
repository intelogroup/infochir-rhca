
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Download, 
  Eye,
  BarChart3,
  Activity
} from "lucide-react";

const MetricCard = ({ title, value, description, icon: Icon, trend }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center mt-1">
          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
          <span className="text-xs text-green-600">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const PopularContent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Contenu populaire</CardTitle>
      <CardDescription>Articles les plus consultés</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { title: "Chirurgie cardiaque avancée", views: 1234, downloads: 89 },
          { title: "Urgences médicales", views: 987, downloads: 67 },
          { title: "Protocoles digestifs", views: 756, downloads: 45 }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">{item.title}</p>
              <div className="flex gap-4 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.views} vues
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {item.downloads} téléchargements
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ActivitySummary = () => (
  <Card>
    <CardHeader>
      <CardTitle>Résumé d'activité</CardTitle>
      <CardDescription>Activité de la dernière semaine</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Lundi</span>
          <Badge variant="outline">45 visites</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Mardi</span>
          <Badge variant="outline">52 visites</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Mercredi</span>
          <Badge variant="outline">38 visites</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Aujourd'hui</span>
          <Badge variant="default">67 visites</Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Analytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics" 
        description="Statistiques et métriques de la plateforme"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Visiteurs uniques"
          value="2,451"
          description="Ce mois"
          icon={Users}
          trend="+12.5%"
        />
        
        <MetricCard
          title="Pages vues"
          value="45,678"
          description="Total des vues"
          icon={Eye}
          trend="+7.1%"
        />
        
        <MetricCard
          title="Téléchargements"
          value="8,921"
          description="PDFs téléchargés"
          icon={Download}
          trend="+15.3%"
        />
        
        <MetricCard
          title="Taux d'engagement"
          value="68%"
          description="Temps sur site"
          icon={Activity}
          trend="+5.2%"
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularContent />
        <ActivitySummary />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Aperçu général
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">89</div>
              <div className="text-sm text-muted-foreground">Articles RHCA</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">158</div>
              <div className="text-sm text-muted-foreground">Articles IGM</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">3,456</div>
              <div className="text-sm text-muted-foreground">Index Medicus</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
