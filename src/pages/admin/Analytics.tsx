
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Eye, 
  Users, 
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  description 
}: {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        <div className={`flex items-center gap-1 text-xs ${
          trend === "up" ? "text-green-600" : 
          trend === "down" ? "text-red-600" : 
          "text-gray-500"
        }`}>
          {trend === "up" && <ArrowUp className="h-3 w-3" />}
          {trend === "down" && <ArrowDown className="h-3 w-3" />}
          <span>{change}</span>
        </div>
        <span className="text-xs text-gray-500 ml-1">{description}</span>
      </div>
    </CardContent>
  </Card>
);

const TopDocuments = () => (
  <Card>
    <CardHeader>
      <CardTitle>Documents les plus consultés</CardTitle>
      <CardDescription>Classement par nombre de vues cette semaine</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { title: "Guide de chirurgie cardiaque", views: 1234, downloads: 456, type: "RHCA" },
          { title: "Urgences médicales 2024", views: 987, downloads: 321, type: "IGM" },
          { title: "Protocoles anesthésie", views: 756, downloads: 234, type: "RHCA" },
          { title: "Atlas chirurgie digestive", views: 654, downloads: 198, type: "IGM" },
        ].map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-semibold text-sm">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{doc.title}</h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {doc.views} vues
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {doc.downloads} téléchargements
                  </span>
                  <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const TrafficSources = () => (
  <Card>
    <CardHeader>
      <CardTitle>Sources de trafic</CardTitle>
      <CardDescription>Origine des visiteurs</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { source: "Recherche Google", percentage: 45, visitors: 2340 },
          { source: "Accès direct", percentage: 28, visitors: 1456 },
          { source: "Réseaux sociaux", percentage: 15, visitors: 780 },
          { source: "Autres sites", percentage: 12, visitors: 624 },
        ].map((source, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm font-medium">{source.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{source.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Analytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics" 
        description="Statistiques et métriques détaillées de la plateforme"
      />

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Visiteurs uniques"
          value="12,345"
          change="+12.5%"
          trend="up"
          icon={Users}
          description="vs mois dernier"
        />
        
        <MetricCard
          title="Pages vues"
          value="45,678"
          change="+8.2%"
          trend="up"
          icon={Eye}
          description="vs mois dernier"
        />
        
        <MetricCard
          title="Téléchargements"
          value="8,921"
          change="+15.3%"
          trend="up"
          icon={Download}
          description="vs mois dernier"
        />
        
        <MetricCard
          title="Taux de rebond"
          value="24.5%"
          change="-2.1%"
          trend="down"
          icon={TrendingUp}
          description="vs mois dernier"
        />
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="technical">Technique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopDocuments />
            <TrafficSources />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Évolution du trafic</CardTitle>
              <CardDescription>Visiteurs et pages vues sur les 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Graphique en cours de développement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">147</CardTitle>
                <CardDescription>Articles RHCA</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="default">+5 ce mois</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">89</CardTitle>
                <CardDescription>Articles IGM</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="default">+3 ce mois</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">3,456</CardTitle>
                <CardDescription>Index Medicus</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Base complète</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Géolocalisation</CardTitle>
                <CardDescription>Répartition géographique des visiteurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: "France", percentage: 45, flag: "🇫🇷" },
                    { country: "Maroc", percentage: 25, flag: "🇲🇦" },
                    { country: "Tunisie", percentage: 15, flag: "🇹🇳" },
                    { country: "Algérie", percentage: 10, flag: "🇩🇿" },
                    { country: "Autres", percentage: 5, flag: "🌍" },
                  ].map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-sm font-medium">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${country.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{country.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appareils utilisés</CardTitle>
                <CardDescription>Type d'appareils des visiteurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { device: "Desktop", percentage: 60 },
                    { device: "Mobile", percentage: 35 },
                    { device: "Tablette", percentage: 5 },
                  ].map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{device.device}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Métriques techniques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Temps de chargement moyen</span>
                  <Badge variant="default">1.2s</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Disponibilité</span>
                  <Badge variant="default">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Erreurs 404</span>
                  <Badge variant="secondary">0.1%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statut système</CardTitle>
                <CardDescription>État des services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base de données</span>
                  <Badge variant="default" className="bg-green-600">Opérationnel</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stockage</span>
                  <Badge variant="default" className="bg-green-600">Opérationnel</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CDN</span>
                  <Badge variant="default" className="bg-green-600">Opérationnel</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
