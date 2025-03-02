
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  debugDatabaseTables,
  updatePdfFilenames,
  updateCoverImageFilenames
} from "@/lib/pdf-utils";
import { toast } from "sonner";

export const RHCADebugTools: React.FC = () => {
  const handleDebugDatabase = () => {
    debugDatabaseTables();
  };

  const handleUpdateFilenames = () => {
    updatePdfFilenames();
  };

  const handleUpdateCoverFilenames = () => {
    updateCoverImageFilenames();
    toast.success("Cover image filenames updated in database");
  };

  return (
    <div className="mb-4 space-y-2">
      <Button 
        variant="outline" 
        className="mr-2" 
        onClick={handleDebugDatabase}
      >
        Debug Database Tables
      </Button>
      <Button 
        variant="outline"
        className="mr-2"
        onClick={handleUpdateFilenames}
      >
        Update PDF Filenames
      </Button>
      <Button 
        variant="outline"
        onClick={handleUpdateCoverFilenames}
      >
        Update Cover Filenames
      </Button>
    </div>
  );
};
