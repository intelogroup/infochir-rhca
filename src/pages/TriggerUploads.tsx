
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TriggerUploads = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const triggerImageUpload = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('upload-founder-images', {
        body: {}
      });

      if (error) {
        console.error("Error uploading founder images:", error);
        toast.error("Une erreur est survenue lors du téléchargement des images des fondateurs");
        return;
      }

      setResults(data.results);
      toast.success("Les images des fondateurs ont été téléchargées avec succès");
    } catch (err) {
      console.error("Exception during upload:", err);
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Téléchargement des images des fondateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={triggerImageUpload} 
            disabled={loading}
            className="mb-6"
          >
            {loading ? "Téléchargement en cours..." : "Télécharger les images des fondateurs"}
          </Button>
          
          {results && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-lg">Résultats:</h3>
              <div className="bg-gray-50 p-4 rounded">
                {results.map((result, index) => (
                  <div key={index} className={`mb-2 p-2 rounded ${
                    result.status === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                    result.status === 'skipped' ? 'bg-blue-50 border-l-4 border-blue-500' :
                    'bg-red-50 border-l-4 border-red-500'
                  }`}>
                    <p className="font-medium">{result.destination}</p>
                    <p className="text-sm text-gray-700">Source: {result.source}</p>
                    <p className="text-sm text-gray-700">Status: {result.status}</p>
                    <p className="text-sm text-gray-700">Message: {result.message}</p>
                  </div>
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
