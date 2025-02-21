
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const RenameFilesButton = () => {
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRename = async () => {
    setIsRenaming(true);
    try {
      const { data, error } = await supabase.functions.invoke('rename-pdf-files');
      
      if (error) {
        console.error('Error renaming files:', error);
        toast.error('Failed to rename files');
        return;
      }

      console.log('Rename operation results:', data);
      toast.success('Files renamed successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while renaming files');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <Button 
      onClick={handleRename} 
      disabled={isRenaming}
      className="mb-4"
    >
      {isRenaming ? 'Renaming Files...' : 'Rename PDF Files'}
    </Button>
  );
};
