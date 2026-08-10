import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectoryList } from "@/components/directory/DirectoryList";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { PageHeader } from "@/components/ui/page-header";
import { SEO } from "@/components/seo/SEO";

const Annuaire = () => {
  useScrollToTop();

  return (
    <MainLayout>
      <SEO
        title="Annuaire des membres | Info CHIR"
        description="Annuaire des chirurgiens et professionnels de santé membres d'Info CHIR, avec spécialités et affiliations."
        path="/annuaire"
      />
      <div className="relative min-h-screen bg-background">
        <div className="pt-[88px]">
          <PageHeader
            backLink="/"
            title="Annuaire des Membres"
            description="Liste des membres d'InfoChir/RHCA, comprenant les professionnels dévoués qui contribuent à l'avancement de la chirurgie et de l'anesthésiologie en Haïti."
            variant="brand"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <DirectoryList />
        </div>
      </div>
    </MainLayout>
  );
};

export default Annuaire;
