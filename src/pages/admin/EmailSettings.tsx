
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Send, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  TestTube,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const EmailSettings = () => {
  const [smtpHost, setSmtpHost] = useState("smtp.resend.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [fromEmail, setFromEmail] = useState("noreply@infochir-rhca.com");
  const [fromName, setFromName] = useState("Infochir-RHCA");
  const [testEmail, setTestEmail] = useState("");

  const handleSaveSettings = () => {
    toast.success("Paramètres email sauvegardés");
  };

  const handleTestEmail = () => {
    if (!testEmail) {
      toast.error("Veuillez saisir une adresse email de test");
      return;
    }
    toast.success(`Email de test envoyé à ${testEmail}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configuration Email" 
        description="Configurez les paramètres d'envoi d'emails"
      />

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">85/100</CardTitle>
            <CardDescription>Emails envoyés aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Limite quotidienne</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">98.5%</CardTitle>
            <CardDescription>Taux de délivrance</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="bg-green-600">Excellent</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                À configurer
              </div>
            </CardTitle>
            <CardDescription>Statut de la configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-yellow-600 text-white">En attente</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp">Configuration SMTP</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres SMTP
              </CardTitle>
              <CardDescription>
                Configurez votre serveur SMTP pour l'envoi d'emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Serveur SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.exemple.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input
                    id="smtpPort"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Nom d'utilisateur</Label>
                  <Input
                    id="smtpUser"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="votre-email@exemple.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Mot de passe / Clé API</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email expéditeur</Label>
                  <Input
                    id="fromEmail"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    placeholder="noreply@exemple.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">Nom expéditeur</Label>
                  <Input
                    id="fromName"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="Votre Nom"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Configuration recommandée</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Service recommandé :</strong> Resend (resend.com)</p>
                  <p><strong>Port :</strong> 587 (TLS) ou 465 (SSL)</p>
                  <p><strong>Authentification :</strong> Requise</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Sauvegarder la configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test d'envoi
              </CardTitle>
              <CardDescription>
                Testez votre configuration email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="testEmail">Email de test</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@exemple.com"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleTestEmail}>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer un test
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Un email de test sera envoyé à l'adresse spécifiée pour vérifier la configuration.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modèles d'email</CardTitle>
              <CardDescription>
                Gérez les modèles d'emails automatiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Email de bienvenue", status: "Actif", lastModified: "15 Jan 2024" },
                  { name: "Notification de soumission", status: "Actif", lastModified: "10 Jan 2024" },
                  { name: "Rappel de mot de passe", status: "Actif", lastModified: "05 Jan 2024" },
                  { name: "Newsletter", status: "Brouillon", lastModified: "01 Jan 2024" },
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-600">
                        Modifié le {template.lastModified}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={template.status === "Actif" ? "default" : "secondary"}>
                        {template.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Logs d'envoi</CardTitle>
                  <CardDescription>
                    Historique des emails envoyés
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    to: "user@exemple.com", 
                    subject: "Bienvenue sur Infochir-RHCA", 
                    status: "Délivré", 
                    time: "Il y a 2h",
                    statusColor: "text-green-600"
                  },
                  { 
                    to: "admin@exemple.com", 
                    subject: "Nouvelle soumission d'article", 
                    status: "Délivré", 
                    time: "Il y a 4h",
                    statusColor: "text-green-600"
                  },
                  { 
                    to: "user2@exemple.com", 
                    subject: "Réinitialisation mot de passe", 
                    status: "En attente", 
                    time: "Il y a 6h",
                    statusColor: "text-yellow-600"
                  },
                  { 
                    to: "invalid@email", 
                    subject: "Newsletter", 
                    status: "Échec", 
                    time: "Il y a 8h",
                    statusColor: "text-red-600"
                  },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{log.subject}</p>
                          <p className="text-xs text-gray-600">À: {log.to}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${log.statusColor}`}>
                        {log.status}
                      </p>
                      <p className="text-xs text-gray-500">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSettings;
