
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { RHCAFileStatus } from './RHCAFileStatus';

interface RHCAUploadInfoProps {
  pdfFilesStatus: Record<string, boolean>;
  coverFilesStatus: Record<string, boolean>;
  pdfFilesList: string[];
  coverFilesList: string[];
}

export const RHCAUploadInfo: React.FC<RHCAUploadInfoProps> = ({
  pdfFilesStatus,
  coverFilesStatus,
  pdfFilesList,
  coverFilesList
}) => {
  return (
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
  );
};
