
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Globe,
  Database,
  Shield,
  Bell
} from "lucide-react";
import { toast } from "sonner";

const SettingsSection = ({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const [siteName, setSiteName] = useState("Infochir-RHCA");
  const [siteDescription, setSiteDescription] = useState("Plateforme médicale pour la chirurgie et la médecine d'urgence");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [publicRegistration, setPublicRegistration] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleSaveGeneral = () => {
    toast.success("Paramètres généraux sauvegardés");
  };

  const handleSaveSecurity = () => {
    toast.success("Paramètres de sécurité sauvegardés");
  };

  const handleBackup = () => {
    toast.success("Sauvegarde lancée avec succès");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Paramètres" 
        description="Configurez les paramètres de la plateforme"
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres du site
              </CardTitle>
              <CardDescription>
                Configuration générale de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Informations du site"
                description="Nom et description de votre plateforme"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL du site</Label>
                    <Input
                      id="siteUrl"
                      value="https://infochir-rhca.com"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </SettingsSection>

              <Separator />

              <SettingsSection
                title="Fonctionnalités"
                description="Activez ou désactivez certaines fonctionnalités"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Analytics</Label>
                      <p className="text-sm text-gray-600">Collecter des données d'utilisation</p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={analyticsEnabled}
                      onCheckedChange={setAnalyticsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicRegistration">Inscription publique</Label>
                      <p className="text-sm text-gray-600">Permettre aux utilisateurs de s'inscrire</p>
                    </div>
                    <Switch
                      id="publicRegistration"
                      checked={publicRegistration}
                      onCheckedChange={setPublicRegistration}
                    />
                  </div>
                </div>
              </SettingsSection>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité et d'accès
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Sécurité du site"
                description="Configuration des paramètres de sécurité"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mode maintenance</Label>
                      <p className="text-sm text-gray-600">Désactiver l'accès public au site</p>
                    </div>
                    <Switch
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>
                  
                  {maintenanceMode && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Mode maintenance activé</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Le site est actuellement en maintenance et n'est accessible qu'aux administrateurs.
                      </p>
                    </div>
                  )}
                </div>
              </SettingsSection>

              <Separator />

              <SettingsSection
                title="Statut des services"
                description="État actuel des services système"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Base de données</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">Opérationnel</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Stockage</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">Opérationnel</Badge>
                  </div>
                </div>
              </SettingsSection>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Gérez les notifications et alertes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Notifications email"
                description="Configurez les notifications par email"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications générales</Label>
                      <p className="text-sm text-gray-600">Recevoir les notifications importantes</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email administrateur</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value="admin@infochir-rhca.com"
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Email support</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value="support@infochir-rhca.com"
                        placeholder="support@exemple.com"
                      />
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Maintenance
              </CardTitle>
              <CardDescription>
                Outils de maintenance et sauvegarde
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Sauvegarde"
                description="Sauvegardez vos données régulièrement"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Sauvegarde manuelle</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Créer une sauvegarde complète maintenant
                    </p>
                    <Button onClick={handleBackup} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Lancer la sauvegarde
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Dernière sauvegarde</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      15 janvier 2024 à 03:00
                    </p>
                    <Badge variant="default" className="bg-green-600">Réussie</Badge>
                  </div>
                </div>
              </SettingsSection>

              <Separator />

              <SettingsSection
                title="Cache"
                description="Gérez le cache de l'application"
              >
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Vider le cache</h4>
                    <p className="text-sm text-gray-600">Supprime tous les fichiers en cache</p>
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Vider le cache
                  </Button>
                </div>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
