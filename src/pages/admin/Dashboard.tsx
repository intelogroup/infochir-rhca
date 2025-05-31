
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Download, 
  BookOpen,
  Mail,
  Calendar,
  TrendingUp
} from "lucide-react";

const StatsCard = ({ title, value, description, icon: Icon, trend }: {
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

const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Actions rapides</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button variant="outline" className="w-full justify-start">
        <FileText className="h-4 w-4 mr-2" />
        Créer un article
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Users className="h-4 w-4 mr-2" />
        Gérer les utilisateurs
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Mail className="h-4 w-4 mr-2" />
        Configuration email
      </Button>
    </CardContent>
  </Card>
);

const RecentActivity = () => (
  <Card>
    <CardHeader>
      <CardTitle>Activité récente</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { action: "Nouvel article publié", time: "Il y a 2h", type: "success" },
          { action: "Utilisateur inscrit", time: "Il y a 3h", type: "info" },
          { action: "PDF téléchargé", time: "Il y a 1h", type: "success" },
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-sm">{activity.action}</span>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Administrateur" 
        description="Vue d'ensemble de la plateforme Infochir-RHCA"
      />

      {/* Welcome Message */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Bienvenue dans l'administration</h2>
              <p className="text-sm text-muted-foreground">
                Connecté en tant qu'administrateur
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Articles RHCA"
          value="89"
          description="Articles publiés"
          icon={FileText}
          trend="+5 ce mois"
        />
        
        <StatsCard
          title="Articles IGM"
          value="158"
          description="Numéros disponibles"
          icon={BookOpen}
          trend="+7 ce mois"
        />
        
        <StatsCard
          title="Index Medicus"
          value="3,456"
          description="Entrées référencées"
          icon={BarChart3}
        />
        
        <StatsCard
          title="Téléchargements"
          value="8,921"
          description="Total des téléchargements"
          icon={Download}
          trend="+15.3%"
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
