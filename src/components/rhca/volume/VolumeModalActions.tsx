
import React from "react";
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";
import type { RhcaVolume } from "../types";

interface VolumeModalActionsProps {
  volume: RhcaVolume;
}

export const VolumeModalActions: React.FC<VolumeModalActionsProps> = ({ volume }) => {
  return (
    <>
      <ShareAction
        id={volume.id}
        title={volume.title}
        contentType="rhca"
        size="sm"
        variant="outline"
      />
      
      {volume.pdfUrl && (
        <>
          <OpenAction
            id={volume.id}
            pdfUrl={volume.pdfUrl}
            size="sm"
            variant="outline"
          />
          
          <DownloadAction
            id={volume.id}
            title={volume.title}
            pdfUrl={volume.pdfUrl}
            contentType="rhca"
            size="sm"
            variant="default"
          />
        </>
      )}
    </>
  );
};
