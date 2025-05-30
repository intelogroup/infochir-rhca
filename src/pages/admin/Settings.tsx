
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Database, Mail, Shield, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Paramètres système" 
        description="Configurez les paramètres généraux de la plateforme"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Paramètres généraux
            </CardTitle>
            <CardDescription>
              Configuration générale de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nom du site</Label>
              <Input id="site-name" defaultValue="Infochir-RHCA" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-description">Description du site</Label>
              <Input id="site-description" defaultValue="Plateforme médicale haïtienne" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode maintenance</Label>
                <p className="text-sm text-gray-500">Activer le mode maintenance</p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <Button>Sauvegarder les paramètres</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuration email
            </CardTitle>
            <CardDescription>
              Paramètres de notification et d'envoi d'emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-server">Serveur SMTP</Label>
              <Input id="smtp-server" placeholder="smtp.example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Port SMTP</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications email</Label>
                <p className="text-sm text-gray-500">Activer les notifications par email</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <Button variant="outline">Tester la configuration</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de données
            </CardTitle>
            <CardDescription>
              Informations et maintenance de la base de données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <p className="text-sm">Connexion OK</p>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold">~500MB</div>
                <p className="text-sm">Taille BD</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Sauvegarder BD</Button>
              <Button variant="outline" size="sm">Optimiser BD</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-gray-500">Exiger 2FA pour les admins</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sessions multiples</Label>
                <p className="text-sm text-gray-500">Autoriser plusieurs sessions</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Délai d'expiration (minutes)</Label>
              <Input id="session-timeout" defaultValue="30" type="number" />
            </div>
            
            <Separator />
            
            <Button variant="destructive" size="sm">Révoquer toutes les sessions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
