
import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

const DAILY_EMAIL_LIMIT = 100; // matches send-email-limit-warning

const EmailSettings = () => {
  const { data: usage = [] } = useQuery({
    queryKey: ['admin-email-usage'],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('email_usage_tracking')
        .select('date, emails_sent, successful_sends')
        .gte('date', since);
      if (error) throw error;
      return data;
    },
  });
  const { data: config } = useQuery({
    queryKey: ['admin-email-config'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-email-config');
      if (error) throw error;
      return data?.data ?? data;
    },
    retry: false,
  });
  const configReady = config?.overall_status === 'READY';
  const failedRecords: Array<{ record: string; type: string; name: string; status: string }> =
    (config?.primary_domain_records?.records ?? []).filter((r: { status: string }) => r.status !== 'verified');
  const today = new Date().toISOString().slice(0, 10);
  const sentToday = usage.find((u) => u.date === today)?.emails_sent ?? 0;
  const sent30 = usage.reduce((n, u) => n + (u.emails_sent ?? 0), 0);
  const ok30 = usage.reduce((n, u) => n + (u.successful_sends ?? 0), 0);
  const deliveryRate = sent30 ? `${((ok30 / sent30) * 100).toFixed(1)}%` : '—';
  const [smtpHost, setSmtpHost] = useState("smtp.resend.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [fromEmail, setFromEmail] = useState("noreply@infochir-rhca.com");
  const [fromName, setFromName] = useState("Infochir-RHCA");
  const [testEmail, setTestEmail] = useState("");

  const handleSaveSettings = () => {
    toast.info("L'envoi passe par Resend : configurez RESEND_API_KEY dans les secrets Supabase. Ces champs ne sont pas enregistrés.");
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error("Veuillez saisir une adresse email de test");
      return;
    }
    const { data, error } = await supabase.functions.invoke('send-test-email', { body: { to: testEmail } });
    if (error || !data?.success) {
      toast.error(`Échec de l'envoi : ${data?.error ?? error?.message ?? 'erreur inconnue'}`);
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
            <CardTitle className="text-2xl">{sentToday}/{DAILY_EMAIL_LIMIT}</CardTitle>
            <CardDescription>Emails envoyés aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Limite quotidienne</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{deliveryRate}</CardTitle>
            <CardDescription>Taux de délivrance (30 j)</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{sent30} envoyés (30 j)</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              <div className="flex items-center gap-2">
                {configReady ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                )}
                {configReady ? 'Configuré' : 'À configurer'}
              </div>
            </CardTitle>
            <CardDescription>Statut de la configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className={configReady ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}>{configReady ? "Prêt" : "En attente"}</Badge>
          </CardContent>
        </Card>
      </div>

      {failedRecords.length > 0 && (
        <Card className="border-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Enregistrements DNS Resend non vérifiés
            </CardTitle>
            <CardDescription>
              {failedRecords.map((r) => `${r.record} ${r.type} ${r.name} (${r.status})`).join(' · ')}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-6">
        <>
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
        </>
      </div>
    </div>
  );
};

export default EmailSettings;
