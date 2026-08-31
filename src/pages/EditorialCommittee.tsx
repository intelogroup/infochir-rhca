import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { EditorialTeam } from "@/components/editorial/EditorialTeam";
import { EditorialMission } from "@/components/editorial/EditorialMission";
import { PageHeader } from "@/components/ui/page-header";
import { SEO } from "@/components/seo/SEO";

const EditorialCommittee = () => (
  <MainLayout>
    <SEO
      title="Comité éditorial | Info CHIR"
      description="Découvrez les membres du comité éditorial d'Info CHIR qui assurent la relecture scientifique de la RHCA et de l'IGM."
      path="/editorial-committee"
    />
    <PageHeader
      backLink="/"
      align="left"
      variant="brand"
      title="Comité éditorial"
      description="Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs, garantissant la qualité et la pertinence des publications."
    />
    <section className="section">
      <div className="container-content">
        <EditorialMission />
        <EditorialTeam />
      </div>
    </section>
  </MainLayout>
);

export default EditorialCommittee;
