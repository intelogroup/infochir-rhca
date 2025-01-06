import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import { mockVolumes } from "@/components/rhca/data/mockVolumes";
import { RhcaVolume } from "@/components/rhca/types";
import { useState } from "react";
import { VolumeModal } from "@/components/rhca/volume/VolumeModal";

const RHCA = () => {
  const [selectedVolume, setSelectedVolume] = useState<RhcaVolume | null>(null);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 space-y-6 sm:space-y-8">
        <section className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-primary">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl">
            Explorez notre collection d'articles scientifiques et de recherches dans le domaine de la chirurgie et de l'anesthésiologie.
          </p>
        </section>

        <RhcaGrid
          volumes={mockVolumes}
          onVolumeView={setSelectedVolume}
        />

        {selectedVolume && (
          <VolumeModal
            volume={selectedVolume}
            open={!!selectedVolume}
            onOpenChange={(open) => !open && setSelectedVolume(null)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default RHCA;