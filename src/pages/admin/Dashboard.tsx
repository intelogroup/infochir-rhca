
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { BarChart, Users, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        description="Gérez le contenu et les utilisateurs de la plateforme Infochir-RHCA"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription>
              Statistiques et métriques d'utilisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Visualisez les métriques d'utilisation et les statistiques de téléchargement.
            </p>
            <Button asChild>
              <Link to="/admin/analytics">Voir les statistiques</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Contenu
            </CardTitle>
            <CardDescription>
              Gérez les articles et publications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Ajoutez, modifiez ou supprimez des articles, des volumes et des publications.
            </p>
            <Button asChild>
              <Link to="/admin/uploads">Gérer les uploads</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Utilisateurs
            </CardTitle>
            <CardDescription>
              Gestion des utilisateurs et des rôles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Gérez les utilisateurs, leurs rôles et leurs permissions.
            </p>
            <Button>Gérer les utilisateurs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
