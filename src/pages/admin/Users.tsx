
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Users = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des utilisateurs" 
        description="Gérez les utilisateurs, leurs rôles et leurs permissions"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Utilisateurs totaux</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">En développement</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Administrateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">En développement</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Éditeurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">En développement</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Actifs ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">En développement</Badge>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gestion des utilisateurs
            </CardTitle>
            <CardDescription>
              Ajoutez, modifiez ou supprimez des comptes utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Cette fonctionnalité sera disponible prochainement. Elle permettra de gérer les comptes utilisateurs de la plateforme.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button disabled>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter utilisateur
              </Button>
              <Button variant="outline" disabled>
                Voir tous les utilisateurs
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rôles et permissions
            </CardTitle>
            <CardDescription>
              Configurez les rôles et permissions des utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Définissez qui peut accéder à quelles fonctionnalités de la plateforme.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium">Administrateur</span>
                <Badge>Accès complet</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium">Éditeur</span>
                <Badge variant="secondary">En développement</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium">Lecteur</span>
                <Badge variant="secondary">En développement</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;
