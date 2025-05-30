
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { BarChart3, Users, FileText, Settings, TrendingUp, BookOpen, Activity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const QuickActionCard = ({ title, description, icon: Icon, href, status, color = "default" }: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  status?: string;
  color?: "default" | "success" | "warning" | "destructive";
}) => (
  <Card className="group hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            color === "success" ? "bg-green-100 text-green-600" :
            color === "warning" ? "bg-yellow-100 text-yellow-600" :
            color === "destructive" ? "bg-red-100 text-red-600" :
            "bg-blue-100 text-blue-600"
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
        {status && (
          <Badge variant={color === "success" ? "default" : "secondary"}>
            {status}
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
        <Link to={href}>Accéder</Link>
      </Button>
    </CardContent>
  </Card>
);

const StatsCard = ({ title, value, description, icon: Icon, trend }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "stable";
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <p className="text-xs text-gray-500 mt-1">
        {description}
        {trend && (
          <span className={`ml-1 ${
            trend === "up" ? "text-green-600" : 
            trend === "down" ? "text-red-600" : 
            "text-gray-500"
          }`}>
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
          </span>
        )}
      </p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, isAdmin } = useAdminAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">
            Bienvenue {user?.email ? user.email.split('@')[0] : 'Administrateur'} - Gérez la plateforme Infochir-RHCA
          </p>
        </div>
        <Badge variant="default" className="px-3 py-1">
          <Activity className="h-3 w-3 mr-1" />
          En ligne
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Articles totaux"
          value="147"
          description="+12 ce mois"
          icon={FileText}
          trend="up"
        />
        <StatsCard
          title="Utilisateurs"
          value="1,234"
          description="+23 cette semaine"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Téléchargements"
          value="8,921"
          description="+156 aujourd'hui"
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="Index Medicus"
          value="3,456"
          description="Articles indexés"
          icon={BookOpen}
          trend="stable"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Analytics"
            description="Statistiques et métriques détaillées"
            icon={BarChart3}
            href="/admin/analytics"
            status="Actuel"
            color="success"
          />
          
          <QuickActionCard
            title="Gestion du contenu"
            description="Gérer articles et publications"
            icon={FileText}
            href="/admin/content"
            status="À jour"
            color="default"
          />
          
          <QuickActionCard
            title="Utilisateurs"
            description="Gérer rôles et permissions"
            icon={Users}
            href="/admin/users"
            status="Actif"
            color="default"
          />
          
          <QuickActionCard
            title="Index Medicus"
            description="Base de données médicale"
            icon={BookOpen}
            href="/admin/index-medicus"
            status="Synchronisé"
            color="success"
          />
          
          <QuickActionCard
            title="Paramètres"
            description="Configuration système"
            icon={Settings}
            href="/admin/settings"
            status="Normal"
            color="default"
          />
          
          <QuickActionCard
            title="Configuration Email"
            description="Paramètres de messagerie"
            icon={AlertCircle}
            href="/admin/email-settings"
            status="À vérifier"
            color="warning"
          />
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            État du système
          </CardTitle>
          <CardDescription>
            Surveillance en temps réel des services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Base de données</span>
              <Badge variant="default" className="bg-green-600">Opérationnel</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Stockage</span>
              <Badge variant="default" className="bg-green-600">Opérationnel</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Email</span>
              <Badge variant="secondary" className="bg-yellow-600 text-white">À configurer</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
