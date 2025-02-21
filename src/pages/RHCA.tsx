
import * as React from "react";
import { UnifiedArticleList } from "@/components/shared/UnifiedArticleList";
import { RHCAHeader } from "@/components/rhca/components/RHCAHeader";
import { RHCASidebar } from "@/components/rhca/components/RHCASidebar";
import { useArticlesState } from "@/components/rhca/hooks/useArticlesState";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RHCA = () => {
  const { viewMode, articles, isLoading } = useArticlesState();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDFs = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-rhca-pdfs');
      
      if (error) throw error;
      
      toast.success('PDFs générés avec succès');
    } catch (error) {
      console.error('Error generating PDFs:', error);
      toast.error('Erreur lors de la génération des PDFs');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <RHCAHeader />
        
        <div className="flex justify-end">
          <Button 
            onClick={generatePDFs}
            disabled={isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isGenerating ? 'Génération en cours...' : 'Générer les PDFs'}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <RHCASidebar />
          <div className="flex-1">
            <UnifiedArticleList
              viewMode={viewMode}
              articles={articles}
              variant="rhca"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHCA;
