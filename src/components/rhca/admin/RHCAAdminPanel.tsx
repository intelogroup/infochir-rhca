
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RHCADebugTools } from './RHCADebugTools';
import { RHCAUploadInfo } from './RHCAUploadInfo';
import { RHCAFileUploaders } from './RHCAFileUploaders';

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
      checkFiles();
    }
  }, [isAdmin]);

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

  const handlePdfUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} fichier(s) PDF uploadé(s) avec succès`, {
        description: "N'oubliez pas de mettre à jour les références dans la base de données."
      });
      console.log('Uploaded PDF files:', urls);
      checkFiles();
    }
  };

  const handleCoverUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      toast.success(`${urls.length} image(s) de couverture uploadée(s) avec succès`);
      console.log('Uploaded cover images:', urls);
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
      
      <RHCAUploadInfo 
        pdfFilesStatus={pdfFilesStatus}
        coverFilesStatus={coverFilesStatus}
        pdfFilesList={pdfFilesList}
        coverFilesList={coverFilesList}
      />
      
      <RHCAFileUploaders
        onPdfUploadComplete={handlePdfUploadComplete}
        onCoverUploadComplete={handleCoverUploadComplete}
      />
    </div>
  );
};
