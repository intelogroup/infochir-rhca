
import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDateToSimple } from "@/lib/utils";

interface RenamePDFFilesProps {
  onSuccess?: () => void;
}

export const RenamePDFFiles: React.FC<RenamePDFFilesProps> = ({ onSuccess }) => {
  const [isRenaming, setIsRenaming] = React.useState(false);

  // Function to format a date to DD-MM-YY
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDateToSimple(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "00-00-00";
    }
  };

  // Generate new filename based on RHCA convention
  const generateNewFilename = (article: any) => {
    const volume = article.volume || "0";
    const issue = article.issue || "0";
    const dateFormatted = formatDate(article.publication_date || new Date().toISOString());
    
    return `RHCA_vol_${volume}_no_${issue}_${dateFormatted}`;
  };

  const handleRenameFiles = async () => {
    setIsRenaming(true);
    
    try {
      // 1. Get all articles that have PDF files
      const { data: articles, error: fetchError } = await supabase
        .from('rhca_articles_view')
        .select('*')
        .not('pdf_url', 'is', null);
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (!articles || articles.length === 0) {
        toast.info("Aucun fichier PDF à renommer");
        return;
      }
      
      toast.info(`${articles.length} fichiers PDF à renommer`);
      
      // 2. Process each article
      let successCount = 0;
      let errorCount = 0;
      
      for (const article of articles) {
        try {
          // Extract current filename
          const currentFilename = article.pdf_url?.split('/').pop();
          if (!currentFilename) continue;
          
          // Generate new filename with extension
          const fileExt = currentFilename.split('.').pop() || 'pdf';
          const newFilename = `${generateNewFilename(article)}.${fileExt}`;
          
          console.log(`Renaming: ${currentFilename} -> ${newFilename}`);
          
          // 3. Copy the file with new name
          const { data: copyData, error: copyError } = await supabase
            .storage
            .from('rhca-pdfs')
            .copy(currentFilename, newFilename);
            
          if (copyError) {
            console.error("Error copying file:", copyError);
            errorCount++;
            continue;
          }
          
          // 4. Update the article record with new filename
          const { error: updateError } = await supabase
            .from('rhca_articles_view')
            .update({ 
              pdf_url: newFilename
            })
            .eq('id', article.id);
            
          if (updateError) {
            console.error("Error updating article record:", updateError);
            errorCount++;
            continue;
          }
          
          // 5. Delete the old file
          const { error: deleteError } = await supabase
            .storage
            .from('rhca-pdfs')
            .remove([currentFilename]);
            
          if (deleteError) {
            console.error("Error deleting original file:", deleteError);
            // Not counting as error since the copy worked
          }
          
          successCount++;
        } catch (err) {
          console.error("Error processing article:", err);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} fichiers PDF renommés avec succès`);
      }
      
      if (errorCount > 0) {
        toast.error(`Échec du renommage de ${errorCount} fichiers PDF`);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error renaming files:", error);
      toast.error("Une erreur est survenue lors du renommage des fichiers");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleRenameFiles}
      disabled={isRenaming}
      className="w-full sm:w-auto"
    >
      {isRenaming ? "Renommage en cours..." : "Renommer les fichiers PDF"}
    </Button>
  );
};
