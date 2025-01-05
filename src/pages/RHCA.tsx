import { MainLayout } from "@/components/layouts/MainLayout";
import { RHCAHero } from "@/components/rhca/RHCAHero";
import { RHCAFeatures } from "@/components/rhca/RHCAFeatures";
import { RHCASubmission } from "@/components/rhca/RHCASubmission";

const RHCA = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <RHCAHero />
        <RHCAFeatures />
        <RHCASubmission />
      </div>
    </MainLayout>
  );
};

export default RHCA;