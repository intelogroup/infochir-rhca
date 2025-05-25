
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { RhcaVolume } from "../types";

interface VolumeModalActionsProps {
  volume: RhcaVolume;
}

export const VolumeModalActions: React.FC<VolumeModalActionsProps> = ({ volume }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/rhca/volumes/${volume.id}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleOpenPdf = () => {
    if (!volume.pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    window.open(volume.pdfUrl, '_blank');
  };

  const handleDownload = async () => {
    if (!volume.pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour ce volume");
      return;
    }
    window.open(volume.pdfUrl, '_blank');
    toast.success("Téléchargement du PDF en cours...");
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Partager
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleOpenPdf}
        disabled={!volume.pdfUrl}
      >
        <ExternalLink className="h-4 w-4" />
        Ouvrir
      </Button>
      <Button
        variant="default"
        size="sm"
        className="gap-2"
        onClick={handleDownload}
        disabled={!volume.pdfUrl}
      >
        <Download className="h-4 w-4" />
        Télécharger PDF
      </Button>
    </>
  );
};
