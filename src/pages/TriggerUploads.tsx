
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

interface UploadResult {
  source: string;
  destination: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
}

const TriggerUploads = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadResult[] | null>(null);

  const triggerImageUpload = async () => {
    try {
      setLoading(true);
      setResults(null);
      
      const { data, error } = await supabase.functions.invoke('upload-founder-images', {
        body: {}
      });

      if (error) {
        console.error("Error uploading founder images:", error);
        toast.error("Une erreur est survenue lors du téléchargement des images des fondateurs");
        return;
      }

      if (!data || !data.results) {
        toast.error("Réponse invalide du serveur");
        return;
      }

      setResults(data.results);
      
      // Count successful uploads
      const successCount = data.results.filter((r: UploadResult) => r.status === 'success').length;
      
      if (successCount > 0) {
        toast.success(`${successCount} image(s) de fondateurs téléchargée(s) avec succès`);
      } else if (data.results.length > 0) {
        toast.info("Aucune nouvelle image n'a été téléchargée");
      } else {
        toast.warning("Aucune image à traiter");
      }
      
    } catch (err) {
      console.error("Exception during upload:", err);
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle>Téléchargement des images des fondateurs</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Cette fonction télécharge les images des fondateurs depuis le dossier 
              <code className="mx-1 px-1 py-0.5 bg-muted rounded text-xs">/lovable-uploads/</code>
              vers le bucket Supabase 
              <code className="mx-1 px-1 py-0.5 bg-muted rounded text-xs">founder_avatars</code>
              et met à jour les profils des fondateurs.
            </p>
            <Button 
              onClick={triggerImageUpload} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Téléchargement en cours..." : "Télécharger les images des fondateurs"}
            </Button>
          </div>
          
          {loading && (
            <div className="space-y-4">
              <LoadingSpinner text="Téléchargement des images en cours" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="p-3 border-b">
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {results && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-lg">Résultats:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, index) => (
                  <Card key={index} className={`overflow-hidden border-l-4 ${
                    result.status === 'success' ? 'border-l-green-500' :
                    result.status === 'skipped' ? 'border-l-blue-500' :
                    'border-l-red-500'
                  }`}>
                    <div className={`p-3 border-b ${
                      result.status === 'success' ? 'bg-green-50' :
                      result.status === 'skipped' ? 'bg-blue-50' :
                      'bg-red-50'
                    }`}>
                      <p className="font-medium truncate" title={result.destination}>
                        {result.destination.split('/').pop()}
                      </p>
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Source:</span> {result.source.split('/').pop()}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={
                          result.status === 'success' ? 'text-green-600' :
                          result.status === 'skipped' ? 'text-blue-600' :
                          'text-red-600'
                        }>
                          {result.status === 'success' ? 'Succès' :
                           result.status === 'skipped' ? 'Ignoré' :
                           'Erreur'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Message:</span> {result.message}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TriggerUploads;
