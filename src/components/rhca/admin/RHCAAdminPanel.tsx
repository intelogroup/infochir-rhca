
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { 
  debugDatabaseTables,
  updatePdfFilenames,
  updateCoverImageFilenames
} from "@/lib/pdf-utils";
import { RHCAFileStatus } from './RHCAFileStatus';
import { RHCADebugTools } from './RHCADebugTools';

interface RHCAAdminPanelProps {
  isAdmin: boolean;
  isDebug: boolean;
}

export const RHCAAdminPanel: React.FC<RHCAAdminPanelProps> = ({ isAdmin, isDebug }) => {
  const [pdfFilesStatus, setPdfFilesStatus] = useState<Record<string, boolean>>({});
  const [coverFilesStatus, setCoverFilesStatus] = useState<Record<string, boolean>>({});
  const [pdfFilesList, setPdfFilesList] = useState<string[]>([]);
  const [coverFilesList, setCoverFilesList] = useState<string[]>([]);

  useEffect(() => {
    if (isAdmin) {
      const checkFiles = async () => {
        // Fetch all PDF files in the storage bucket
        const { data: pdfFiles, error: pdfError } = await supabase.storage
          .from('rhca-pdfs')
          .list('');
          
        if (pdfError) {
          console.error('[RHCA] Error fetching PDF files:', pdfError);
        } else if (pdfFiles) {
          const fileNames = pdfFiles.map(file => file.name);
          setPdfFilesList(fileNames);
          console.log('[RHCA] PDF files in storage:', fileNames);
        }

        // Fetch all cover image files in the storage bucket
        const { data: coverFiles, error: coverError } = await supabase.storage
          .from('rhca_covers')
          .list('');
          
        if (coverError) {
          console.error('[RHCA] Error fetching cover image files:', coverError);
        } else if (coverFiles) {
          const coverNames = coverFiles.map(file => file.name);
          setCoverFilesList(coverNames);
          console.log('[RHCA] Cover image files in storage:', coverNames);
        }
        
        const volumeIssues = ['2:47', '3:48', '4:49'];
        const pdfStatus: Record<string, boolean> = {};
        const coverStatus: Record<string, boolean> = {};
        
        console.log("[RHCA] Starting file verification for admin panel...");
        
        // File naming patterns
        for (const vi of volumeIssues) {
          const [volume, issue] = vi.split(':');
          const pdfFilePattern = `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}`;
          const coverFilePattern = `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}_cover`;
          
          console.log(`[RHCA] Checking files for volume:issue ${vi}`);
          console.log(`[RHCA] PDF pattern: ${pdfFilePattern}`);
          console.log(`[RHCA] Cover pattern: ${coverFilePattern}`);
          
          // Check for PDFs
          const { data: pdfFiles } = await supabase.storage
            .from('rhca-pdfs')
            .list('', { search: pdfFilePattern });
            
          pdfStatus[vi] = pdfFiles && pdfFiles.length > 0;
          
          // Check for covers
          const { data: coverFiles } = await supabase.storage
            .from('rhca_covers')
            .list('', { search: coverFilePattern });
            
          coverStatus[vi] = coverFiles && coverFiles.length > 0;
          
          console.log(`[RHCA] Status for ${vi} - PDF: ${pdfStatus[vi]}, Cover: ${coverStatus[vi]}`);
        }
        
        setPdfFilesStatus(pdfStatus);
        setCoverFilesStatus(coverStatus);
        
        console.log("[RHCA] File verification complete", { pdfStatus, coverStatus });
      };
      
      checkFiles();
    }
  }, [isAdmin]);

  const handlePdfUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} fichier(s) PDF uploadé(s) avec succès`, {
        description: "N'oubliez pas de mettre à jour les références dans la base de données."
      });
      console.log('Uploaded PDF files:', urls);
      
      // Refresh file status checks
      const checkFiles = async () => {
        const volumeIssues = ['2:47', '3:48', '4:49'];
        const pdfStatus: Record<string, boolean> = {};
        
        for (const vi of volumeIssues) {
          const [volume, issue] = vi.split(':');
          const pdfFilePattern = `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}`;
          
          const { data: pdfFiles } = await supabase.storage
            .from('rhca-pdfs')
            .list('', { search: pdfFilePattern });
            
          pdfStatus[vi] = pdfFiles && pdfFiles.length > 0;
        }
        
        setPdfFilesStatus(pdfStatus);
      };
      
      checkFiles();
    }
  };

  const handleCoverUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} image(s) de couverture uploadée(s) avec succès`);
      console.log('Uploaded cover images:', urls);
      
      // Refresh file status checks
      const checkFiles = async () => {
        const volumeIssues = ['2:47', '3:48', '4:49'];
        const coverStatus: Record<string, boolean> = {};
        
        for (const vi of volumeIssues) {
          const [volume, issue] = vi.split(':');
          const coverFilePattern = `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}_cover`;
          
          const { data: coverFiles } = await supabase.storage
            .from('rhca_covers')
            .list('', { search: coverFilePattern });
            
          coverStatus[vi] = coverFiles && coverFiles.length > 0;
        }
        
        setCoverFilesStatus(coverStatus);
      };
      
      checkFiles();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-white shadow-sm rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Admin: Upload RHCA Files</h2>
      
      {isDebug && <RHCADebugTools />}
      
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Gestion des fichiers RHCA</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Pour que les fichiers soient correctement associés aux articles, suivez ces conventions de nommage:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>PDF:</strong> RHCA_vol_XX_no_XX_date.pdf (ex: RHCA_vol_04_no_49_11_1_2025.pdf)</li>
            <li><strong>Couvertures:</strong> RHCA_vol_XX_no_XX_cover.png (ex: RHCA_vol_04_no_49_cover.png)</li>
          </ul>
          
          <RHCAFileStatus 
            pdfFilesStatus={pdfFilesStatus}
            coverFilesStatus={coverFilesStatus}
            pdfFilesList={pdfFilesList}
            coverFilesList={coverFilesList}
          />
          
          <p className="text-xs mt-1 text-gray-500">
            Assurez-vous que les noms de fichiers correspondent aux volumes et numéros dans la base de données.
          </p>
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-md font-medium mb-2">Cover Images</h3>
          <MultiFileUploader
            bucket="rhca_covers"
            acceptedFileTypes={{
              'image/*': ['.png', '.jpg', '.jpeg', '.webp']
            }}
            maxFileSize={5}
            maxFiles={10}
            onUploadComplete={handleCoverUploadComplete}
            helperText="Upload cover images for RHCA articles (PNG, JPG, WebP)"
            type="image"
            volumeInfo={{
              volume: '4',
              issue: '49'
            }}
          />
        </div>
        <div>
          <h3 className="text-md font-medium mb-2">PDF Documents</h3>
          <MultiFileUploader
            bucket="rhca-pdfs"
            acceptedFileTypes={{
              'application/pdf': ['.pdf']
            }}
            maxFileSize={10}
            maxFiles={5}
            onUploadComplete={handlePdfUploadComplete}
            helperText="Upload PDF documents for RHCA articles"
            type="document"
            volumeInfo={{
              volume: '4',
              issue: '49'
            }}
          />
        </div>
      </div>
    </div>
  );
};
