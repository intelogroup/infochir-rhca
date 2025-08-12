
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Mail, 
  Database, 
  Shield,
  Save
} from "lucide-react";
import { SensitiveAdminGuard } from "@/components/admin/security/SensitiveAdminGuard";
import { useAdminSecurity } from "@/components/admin/security/AdminSecurityProvider";

const SystemStatus = () => (
  <Card>
    <CardHeader>
      <CardTitle>État du système</CardTitle>
      <CardDescription>Statut des services</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { service: "Base de données", status: "Opérationnel" },
          { service: "Stockage fichiers", status: "Opérationnel" },
          { service: "Service email", status: "Opérationnel" }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium">{item.service}</span>
            <Badge variant="default" className="bg-green-600">
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const GeneralSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <SettingsIcon className="h-5 w-5" />
        Paramètres généraux
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="siteName">Nom du site</Label>
        <Input
          id="siteName"
          defaultValue="Infochir-RHCA"
          placeholder="Nom du site"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminEmail">Email administrateur</Label>
        <Input
          id="adminEmail"
          type="email"
          defaultValue="admin@infochir-rhca.com"
          placeholder="email@exemple.com"
        />
      </div>
      <Button className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Sauvegarder
      </Button>
    </CardContent>
  </Card>
);

const SecuritySettings = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Sécurité
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Authentification à deux facteurs</p>
          <p className="text-sm text-muted-foreground">Sécurité renforcée</p>
        </div>
        <Badge variant="outline">Désactivé</Badge>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Logs de sécurité</p>
          <p className="text-sm text-muted-foreground">Surveillance des accès</p>
        </div>
        <Badge variant="default">Actif</Badge>
      </div>
    </CardContent>
  </Card>
);

const QuickActions = () => {
  const { confirmAction } = useAdminSecurity();

  const handleDatabaseBackup = async () => {
    try {
      await confirmAction({
        title: "Sauvegarde base de données",
        description: "Vous êtes sur le point de lancer une sauvegarde complète de la base de données. Cette opération peut prendre plusieurs minutes.",
        confirmText: "Lancer la sauvegarde",
        requirePassword: true,
        eventType: 'database_backup_initiated',
        eventData: { timestamp: new Date().toISOString() }
      });
      
      // Here you would trigger the actual backup
      console.log("Database backup initiated");
    } catch (error) {
      console.error("Backup cancelled:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          <Mail className="h-4 w-4 mr-2" />
          Configuration email
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleDatabaseBackup}
        >
          <Database className="h-4 w-4 mr-2" />
          Sauvegarde base de données
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Shield className="h-4 w-4 mr-2" />
          Gérer les permissions
        </Button>
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Paramètres" 
        description="Configuration du système"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <GeneralSettings />
          <SensitiveAdminGuard
            title="Paramètres de sécurité"
            description="Configuration des paramètres de sécurité du système. Accès restreint aux super-administrateurs."
            requirePassword={true}
            level="high"
            confirmText="Accéder aux paramètres de sécurité"
          >
            <SecuritySettings />
          </SensitiveAdminGuard>
        </div>
        <div className="space-y-6">
          <SystemStatus />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Settings;
