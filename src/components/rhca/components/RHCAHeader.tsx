import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";

const RHCAHeader: React.FC = () => (
  <PageHeader
    backLink="/"
    logoSrc="/lovable-uploads/d58e1745-03a7-4274-9d8f-889b058635f6.png"
    logoAlt="RHCA Logo"
    title="Revue Haïtienne de Chirurgie et d'Anesthésiologie"
    description="La référence en chirurgie et anesthésiologie en Haïti"
    variant="secondary"
  />
);

export { RHCAHeader };
