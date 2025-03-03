
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { IGMEditorialCommittee } from "@/components/editorial/IGMEditorialCommittee";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";

const IGMEditorialCommitteePage = () => (
  <MainLayout>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <EditorialHeader 
        title="Comité Éditorial de l'Info Gazette Médicale"
        description="Les membres du comité éditorial de l'IGM sont des experts dans leurs domaines respectifs, garantissant la qualité et la pertinence des publications."
        backLink="/igm"
        backText="Retour à IGM"
      />
      <IGMEditorialCommittee />
    </div>
  </MainLayout>
);

export default IGMEditorialCommitteePage;
