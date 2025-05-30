
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
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  BookOpen,
  Mail
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
          <TrendingUp className="h-3 w-3" />
          <span>{change}</span>
        </div>
        <span className="text-xs text-gray-500 ml-1">{description}</span>
      </div>
    </CardContent>
  </Card>
);

const RecentActivity = () => (
  <Card>
    <CardHeader>
      <CardTitle>Activité récente</CardTitle>
      <CardDescription>Dernières actions sur la plateforme</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { 
            action: "Nouvel article RHCA publié", 
            user: "Dr. Martin Dubois", 
            time: "Il y a 2h",
            status: "success",
            icon: FileText
          },
          { 
            action: "Utilisateur inscrit", 
            user: "user@exemple.com", 
            time: "Il y a 3h",
            status: "info",
            icon: Users
          },
          { 
            action: "PDF téléchargé", 
            user: "Visiteur anonyme", 
            time: "Il y a 5h",
            status: "success",
            icon: Download
          },
          { 
            action: "Email envoyé", 
            user: "Système", 
            time: "Il y a 1j",
            status: "success",
            icon: Mail
          }
        ].map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activity.status === "success" ? "bg-green-100 text-green-600" :
              activity.status === "info" ? "bg-blue-100 text-blue-600" :
              "bg-gray-100 text-gray-600"
            }`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{activity.action}</p>
              <p className="text-xs text-gray-600">par {activity.user}</p>
            </div>
            <span className="text-xs text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SystemStatus = () => (
  <Card>
    <CardHeader>
      <CardTitle>État du système</CardTitle>
      <CardDescription>Statut des services</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { service: "Base de données", status: "Opérationnel", icon: CheckCircle, color: "text-green-600" },
          { service: "Stockage", status: "Opérationnel", icon: CheckCircle, color: "text-green-600" },
          { service: "Email", status: "Opérationnel", icon: CheckCircle, color: "text-green-600" },
          { service: "Sauvegarde", status: "En cours", icon: Clock, color: "text-yellow-600" }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-sm font-medium">{item.service}</span>
            </div>
            <Badge variant={item.status === "Opérationnel" ? "default" : "secondary"} className="text-xs">
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Actions rapides</CardTitle>
      <CardDescription>Raccourcis pour les tâches courantes</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button variant="outline" className="w-full justify-start">
        <FileText className="h-4 w-4 mr-2" />
        Créer un nouvel article
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Users className="h-4 w-4 mr-2" />
        Gérer les utilisateurs
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <BarChart3 className="h-4 w-4 mr-2" />
        Voir les analytics
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Mail className="h-4 w-4 mr-2" />
        Configuration email
      </Button>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Administrateur" 
        description="Vue d'ensemble de votre plateforme Infochir-RHCA"
      />

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Bienvenue dans l'administration</h2>
              <p className="text-blue-700 text-sm">
                Utilisateur connecté: jimkalinov@gmail.com | Rôle: Administrateur
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Utilisateurs totaux"
          value="1,234"
          change="+12.5%"
          trend="up"
          icon={Users}
          description="vs mois dernier"
        />
        
        <MetricCard
          title="Articles publiés"
          value="247"
          change="+8.2%"
          trend="up"
          icon={FileText}
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
          title="Pages vues"
          value="45,678"
          change="+7.1%"
          trend="up"
          icon={Eye}
          description="vs mois dernier"
        />
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">89</CardTitle>
            <CardDescription>Articles RHCA</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">+5 ce mois</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">158</CardTitle>
            <CardDescription>Articles IGM</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">+7 ce mois</Badge>
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

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <SystemStatus />
        <QuickActions />
        
        <Card>
          <CardHeader>
            <CardTitle>Alertes importantes</CardTitle>
            <CardDescription>Notifications système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Sauvegarde programmée</p>
                  <p className="text-xs text-yellow-700">Sauvegarde automatique prévue ce soir à 02:00</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Mise à jour Index Medicus</p>
                  <p className="text-xs text-blue-700">15 nouvelles entrées ajoutées aujourd'hui</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
