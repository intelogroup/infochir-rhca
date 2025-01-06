import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";
import { AtlasTableOfContents } from "@/components/atlas/AtlasTableOfContents";

const ADC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-[50px]">
        <ADCHeader />
        <ADCMission />
        <AtlasTableOfContents />
        <ADCSubmission />
      </div>
    </MainLayout>
  );
};

export default ADC;