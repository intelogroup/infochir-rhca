
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { checkEmailConfiguration } from "@/lib/email-config-checker";
import { toast } from "sonner";

export const EmailConfigStatus = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [configStatus, setConfigStatus] = useState(null);

  const handleCheckConfig = async () => {
    setIsChecking(true);
    
    try {
      const result = await checkEmailConfiguration();
      
      if (result.success) {
        setConfigStatus(result.data);
        toast.success("Configuration email vérifiée avec succès");
      } else {
        toast.error("Erreur lors de la vérification de la configuration email");
      }
    } catch (error) {
      console.error('Error checking email config:', error);
      toast.error("Erreur lors de la vérification");
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "READY":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Prêt</Badge>;
      case "CONFIGURATION_NEEDED":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Configuration requise</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Inconnu</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          État de la configuration email
          <Button 
            onClick={handleCheckConfig} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Vérifier
          </Button>
        </CardTitle>
        <CardDescription>
          Vérifiez l'état de votre configuration Resend pour l'envoi d'emails
        </CardDescription>
      </CardHeader>
      
      {configStatus && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">État général:</span>
            {getStatusBadge(configStatus.overall_status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Clé API Resend</h4>
              <div className="flex items-center space-x-2">
                {configStatus.api_key_status?.valid ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-600">
                  {configStatus.api_key_status?.message}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Domaine info-chir.org</h4>
              <div className="flex items-center space-x-2">
                {configStatus.primary_domain_status?.verified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-600">
                  {configStatus.primary_domain_status?.message}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Variables d'environnement</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                {configStatus.environment_variables?.resend_api_key ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-600" />
                )}
                <span>RESEND_API_KEY</span>
              </div>
              <div className="flex items-center space-x-2">
                {configStatus.environment_variables?.supabase_url ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-600" />
                )}
                <span>SUPABASE_URL</span>
              </div>
            </div>
          </div>

          {configStatus.recommendations?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Recommandations</h4>
              <div className="space-y-2">
                {configStatus.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">{rec.message}</p>
                        <p className="text-xs text-amber-700 mt-1">{rec.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
