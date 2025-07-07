import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BackfillResult {
  filename: string;
  success: boolean;
  error?: string;
  id?: string;
}

interface BackfillResponse {
  message: string;
  totalProcessed: number;
  successful: number;
  failed: number;
  results: BackfillResult[];
}

export const RHCABackfillPanel: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BackfillResponse | null>(null);

  const handleBackfill = async () => {
    setIsProcessing(true);
    setResults(null);

    try {
      toast.info("Démarrage du processus de remplissage des articles RHCA...");
      
      const { data, error } = await supabase.functions.invoke('backfill-rhca-articles');
      
      if (error) {
        throw error;
      }

      setResults(data);
      
      if (data.successful > 0) {
        toast.success(`${data.successful} articles RHCA ajoutés avec succès!`);
      }
      
      if (data.failed > 0) {
        toast.warning(`${data.failed} articles ont échoué lors du processus.`);
      }
      
    } catch (error) {
      console.error('RHCA Backfill error:', error);
      toast.error("Erreur lors du remplissage des articles RHCA");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Remplissage Articles RHCA
        </CardTitle>
        <CardDescription>
          Analyser et ajouter automatiquement les articles RHCA manquants dans la base de données
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Cette fonction va analyser les PDFs RHCA stockés et créer automatiquement les entrées manquantes dans la base de données avec du contenu généré par IA.
          </div>
        </div>

        <Button 
          onClick={handleBackfill}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Démarrer le remplissage RHCA
            </>
          )}
        </Button>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.totalProcessed}</div>
                <div className="text-sm text-muted-foreground">Total traité</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.successful}</div>
                <div className="text-sm text-muted-foreground">Réussis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-muted-foreground">Échoués</div>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {results.results.map((result, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">{result.filename}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Succès" : "Échec"}
                    </Badge>
                    {result.error && (
                      <span className="text-xs text-red-600 max-w-xs truncate" title={result.error}>
                        {result.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};